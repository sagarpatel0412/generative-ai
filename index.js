const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
dotenv.config();
const PORT = process.env.NODE_PORT || 8000;
const { model } = require('./generative-ai');
const { sequelize } = require('./sequelize');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  return res.status(201).json({
    message: 'Welcome to generative ai',
  });
});

app.post('/model', async (req, res) => {
  try {
    const response = await model.generateContent(req.body.prompt);
    if (response) {
      const ab = {
        ...response,
        allresponse: response.response.candidates.map((i) => {
          return i.content.parts.map((ik) => {
            let text1 = ik.text;
            text1 = text1.replace(
              /(\bclass\b|\bdef\b|\bif\b|\belse\b|\bwhile\b)/g,
              '<span class="keyword">$1</span>'
            );
            text1 = text1.replace(
              /(\"\"\"[\s\S]*?\"\"\")/g,
              '<span class="comment">$1</span>'
            ); // Docstrings
            text1 = text1.replace(
              /(\".*?\"|\'.*?\')/g,
              '<span class="string">$1</span>'
            ); // Strings
            text1 = text1.replace(/(#.*)/g, '<span class="comment">$1</span>'); // Single-line comments
            return {
              question: req.body.prompt,
              ...ik,
              html: text1 || '',
            };
          });
        }),
      };
      return res.status(201).json(ab);
    }
    return res.status(201).json(response);
  } catch (error) {
    console.log('error.response', error);
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(`Connected to Database`);
  })
  .catch((error) => {
    console.log('Error', error);
  });

app.listen(PORT, () => {
  console.log(`App started on ${PORT}`);
});
