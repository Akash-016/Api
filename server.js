const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const asy_h=require('express-async-handler')

const app = express();
const PORT = process.env.PORT || 3000;
const CHAT_GPT_API_KEY = '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';

app.use(express.urlencoded({ extended: false }))
app.get('/',asy_h(async(req,res)=>{
    res.send(`<form action="/dataupdate" method="post">
     <input type="text" name="te">
     <button>Submit</button>
   </form>`)
}))
app.post('/dataupdate',asy_h(async(req,res)=>{
  const blogData = [
    "Blog title",
    "Blog content",
    "Meta Title",
    "Meta Description",
    "Focused keyword"
  ];
    const t=req.body.te;
    const responses = [];
  
  for (let i = 0; i < blogData.length; i++) {
    const message = "I need the " + blogData[i] + " about the " + t;
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHAT_GPT_API_KEY}`,
        },
      });

      const reply = response.data.choices[0].message.content;
      res.write(blogData[i]+':'+'\n'+'\n'+ reply + '\n'+'\n');
    } catch (error) {
      console.error('Error calling ChatGPT API:', error.message);
      res.status(500).json({ error: 'Failed to get a response from ChatGPT API' });
    }
  }

  res.send(responses);
    // res.send(s);
}))
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
 });
