import { tryCatch, Worker } from "bullmq";
import connection from "../config/bullmq-connection.js";
import { sendVerificationEmail } from "../services/emailService/sendVerificationMail.js";

const worker = new Worker('email',async(job)=>{
    console.log(`processing job ${job.id} - ${job.name}`);

    try {
        if(job.name==='verification-mail'){
            await sendVerificationEmail(job.data)
        }
    } catch (error) {
        console.error(`job ${job.id} failed ${error.message}`,{error})
        throw error;
    }

},{
    connection,
    concurrency:5
});

worker.on('completed',(job)=>{
    console.log(`job ${job.id} ${job.name} is completed`);
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`, { error: err });
});

worker.on('error', (err) => {
  console.error('Worker encountered an error:', { error: err });
});

console.info('BullMQ Email Worker started — ready to process email jobs!');