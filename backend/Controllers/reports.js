const User = require('../Models/User');
const Expense = require('../Models/Expense');
const { Op, where } = require('sequelize');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const region = 'ap-southeast-2';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    },
    region: region
})

async function s3Upload(data, filename) {
    const bucket = process.env.BUCKET_NAME;

    const uploadParams = {
        Bucket: bucket,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    try {
        const command = new PutObjectCommand(uploadParams);

        const response = await s3.send(command);
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(filename)}`;
        return { response, url };
    }
    catch (e) {
        console.log(e);
        return { error: e.message };
    }
}

exports.getReports = async (req, res, next) => {
    try {
        const { date, month, page_no } = req.query;
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        // if (user.isPremium !== true) return res.status(403).json({ error: "Access to the requested resource is forbidden for non-premium users." });

        const start = (page_no - 1) * 10 ||0;
        let whereClause={};

        if (date) {
            whereClause.date = date;
        }
        else {
            const [year, monthNumber] = month.split('-').map(Number);

            // Create a date object for the first day of the next month, then subtract one day
            const lastDate = new Date(year, monthNumber, 0).getDate();

            whereClause.date = {
                [Op.gte]: `${month}-01`,
                [Op.lte]: `${month}-${lastDate}`
            }
        }

        const expenses = await user.getExpenses({
            where: whereClause,
            offset: start,
            limit: 10
        })

        const response={
            expenses,
            current:parseInt(page_no)||1
        }
        
        if(!page_no){
            const count=await user.countExpenses({
                where:whereClause
            })
            response.lastPage=Math.ceil(count/10);
        }

        return res.json(response);
    }

    catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.download = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        if (user.isPremium !== true) return res.status(403).json({ error: "Access to the requested resource is forbidden for non-premium users." });

        const date = new Date().toISOString();

        const expenses = await user.getExpenses();
        const filename = `Expenses_${user.id}/${date}.txt`
        const uploaded = await s3Upload(JSON.stringify(expenses), filename);

        if (uploaded.error) throw new Error('Failed to Upload');
        return res.status(200).json(uploaded.url);

    }

    catch (e) {
        return res.status(500).json({ error: 'Some internal issue' });
    }
}