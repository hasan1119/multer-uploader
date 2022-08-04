# multer.js

```
npm i multer.js
```

#### multerUpload function

#

You can import `multerUpload` function just adding this line of code `const multerUpload = require('multer.js')`.

#

Follow the example below and provide all the arguments

```
multerUpload(
    absolute_upload_directory,
    max_file_size_in_byte,
    max_number_of_file_in_number,
    allowed_file_meme_type_in_array
    )
```

```
multerUpload(
    path.join(__dirname,"public", "uploads"),
    1000,
    2,
    ['png/image', 'jpg/image', 'jpeg/image']
    )
```
