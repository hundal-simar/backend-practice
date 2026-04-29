const chalk=require('chalk');
const fs=require('fs').promises;
const path=require('path');
const os=require('os');
const EventEmitter=require('events');

const emitter= new EventEmitter();

emitter.on('done',()=>{
    console.log(chalk.green('\nAnalysis completed successfully!'));
})

const filePath=process.argv[2];

if(!filePath){
    console.error(chalk.red('Please provide a file path as an argument.'));
    process.exit(1);
}

const fileName=path.basename(filePath);
const platform=os.platform();

async function analyzeFile(){
    try{
        const data=await fs.readFile(filePath,'utf-8');

        const chars=data.length;
        const lines=data.split('\n').length;
        const wordsArray=data
                          .toLowerCase()
                          .replace(/[^\w\s]/g, '')
                          .split(/\s+/)
                          .filter(Boolean);

        const words=wordsArray.length;
        const freq={};
        wordsArray.forEach(word=>{
            freq[word]=(freq[word]||0)+1;
        });

        const topWords=Object.entries(freq)
                            .sort((a,b)=>b[1]-a[1])
                            .slice(0,3)
                            .map(([word,count])=>`${word} (${count})`)
                            .join(', ');

        console.log(chalk.blue(`File: ${fileName}`));
        console.log(chalk.yellow(`Platform: ${platform}`));
        console.log(chalk.green(`Characters: ${chars}`));
        console.log(chalk.green(`Words: ${words}`));
        console.log(chalk.green(`Lines: ${lines}`));
        console.log(chalk.magenta(`Top Words: ${topWords}`));

        emitter.emit('done');

    }catch(err){
        console.error(chalk.red('Error analyzing file:'), err);
    }
}
analyzeFile();