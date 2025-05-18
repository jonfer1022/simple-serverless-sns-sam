import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const topicARN = process.env.TOPIC_ARN;
const region = process.env.REGION;

const sns = new SNSClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region
})

export const handler = async (event, context) => {
    console.log("--> Credentials: ", process.env)
    console.log("--> Event: ", event);
    const records = event.Records;
    console.log("--> Records: ",records);

    if(!records) {
        console.log("No records processed!");
        return 0;
    }

    for (const record of records) {
        if(!record.body) {
            throw new Error("No body in SQS record");
        }
        const input = {
            Message: record.body,
            TopicArn: topicARN,
            Subject: "Processed SQS Queue messages"
        }
        console.log("Input: ", input);
        const command = new PublishCommand(input)
        const res = await sns.send(command)
        console.log(res, record.body)
        console.log("SQS message processed: " + record.body)
    }
}