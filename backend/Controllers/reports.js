const User = require('../Models/User');
const { Op } = require('sequelize');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const region='ap-southeast-2';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    },
    region:region
})

console.log(s3.region);

async function s3Upload(data, filename) {
    const bucket = process.env.BUCKET_NAME;

    const uploadParams = {
        Bucket: bucket,
        Key: filename,
        Body: data,
        ACL:'public-read'
    }
    try {
        const command=new PutObjectCommand(uploadParams);

        const response = await s3.send(command);
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(filename)}`;
        return {response,url};
    }
    catch (e) {
        console.log(e);
        return {error:e.message};
    }
}

exports.getReports = async (req, res, next) => {
    try {
        const { date, month } = req.query;
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        if (user.isPremium !== true) return res.status(403).json({ error: "Access to the requested resource is forbidden for non-premium users." });

        let expenses;

        if (date) {
            expenses = await user.getExpenses({
                where: {
                    date
                }
            });
        }
        else {
            const [year, monthNumber] = month.split('-').map(Number);

            // Create a date object for the first day of the next month, then subtract one day
            const lastDate = new Date(year, monthNumber, 0).getDate();

            expenses = await user.getExpenses({
                where: {
                    date: {
                        [Op.gte]: `${month}-01`,
                        [Op.lte]: `${month}-${lastDate}`
                    }
                },
            });
        }
        return res.json(expenses);

    }

    catch (e) {
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

        if(uploaded.error)throw new Error('Failed to Upload');
        return res.status(200).json(uploaded.url);

    }

    catch (e) {
        return res.status(500).json({ error: 'Some internal issue' });
    }
}