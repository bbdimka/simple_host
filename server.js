const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Проверка и создание папок
const folders = ['uploads/videos', 'uploads/images', 'uploads/musics'];
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = file.mimetype.split('/')[0];
    if (type === 'audio') {
      cb(null, 'uploads/musics/');
    } else if (type === 'image') {
      cb(null, 'uploads/images/');
    } else if (type === 'video') {
      cb(null, 'uploads/videos/');
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, 'videos.html'));
});

app.get('/images', (req, res) => {
  res.sendFile(path.join(__dirname, 'images.html'));
});

app.get('/musics', (req, res) => {
  res.sendFile(path.join(__dirname, 'musics.html'));
});

// Обработчик для загрузки нескольких файлов
app.post('/upload', upload.array('mediaFiles'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const filenames = req.files.map((file) => file.filename);
  res.json({ filenames });
});

// Обработчик для получения списка медиафайлов для всех типов
app.get('/list/:type', (req, res) => {
  const type = req.params.type;
  const validTypes = ['videos', 'images', 'audios', 'musics'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid media type.' });
  }

  fs.readdir(path.join(__dirname, 'uploads', type), (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log(files);
    res.json(files);
  });
});

// Обработчик для переименования файла
app.get('/rename/:oldFilename/:newFilename', (req, res) => {
  const oldFilename = req.params.oldFilename;
  const newFilename = req.params.newFilename;
  
  // Получите тип файла на основе oldFilename и убедитесь, что он допустим

  // Сгенерируйте новый путь к файлу на сервере на основе newFilename и типа файла
  
  // Переименуйте файл с использованием fs.rename

  // Верните успешный или неуспешный ответ клиенту
});

app.use('/uploads', express.static('uploads'));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://192.168.1.175:${port}`);
});
