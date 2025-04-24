# NESTJS MINI PROJECT UNTUK PENGUJIAN DI DOT INDONESIA, MALANG, JAWA TIMUR.
<b>Penulis: Rainhard Vidiansyah</b>

#
Project ini merupakan mini project yang dimaksudkan untuk menulis mini library online dengan fitur: 
1. Registration
2. Login
3. Logout
4. Refresh Token
5. Pinjam buku yang hanya bisa dilakukan oleh Member
6. Melihat buku yang dipinjam oleh Member
7. Beberapa endpoint di authenticationcontroller untuk membuktikan bahwa hanya user dengan *role* tertentu saja yang bisa akses suatu endpoint atau resource

#
Library utama yang digunakan dalam project ini:
1. Typeorm (Object Relational Mapper)
2. Mysql
3. JWT
4. Redis
5. Swagger OPEN API
#
Cara instalasi:
1. git clone https://github.com/Rainhardvidiansyah/dot-library-management.git
2. git fetch --all
3. git switch development
4. Tulis file dotenv (.env) di root project. Adapun contohnya telah penulis tulis di .env.example
5. Tulis perintah *npm run start* atau *npm run start:dev*

Catatan: Penulis meletakkan semua *branch* di *development* sebelum merge ke __master__ atau __main__
#
__Database dan table__

<p>Database yang penulis pakai dalam project ini adalah mysql.</p>

<p>Table yang eksis pada gilirannya akan dihasilkan tatkala kita menjalankan perintah seperti yang ada di nomor 5. Project ini sengaja menggunakan 'synchronize: true' agar table dihasilkan dengan otomatis oleh TypeOrm. Ini dilakukan demi kemudahan 'pengujian' aplikasi itu sendiri.</p>


Untuk table yang ada di dalam project ini adalah sebagai berikut:
1. authors
2. authors_books
3. books
4. borrowings
5. refresh_tokens
6. roles
7. user_roles
8. users

<p>Untuk verifikasi semua table di atas masuk ke mysql via terminal atau database GUI seperti DbGate atau DBeaver lalu tulis "SHOW TABLES" di Mysql. Dan jangan lupa untuk membuat database-nya dengan perintah CREATE DATABASE NAMA_DB_ANDA</p>

#
__CONTROLLER (localhost:3000/api/v1/)__

#
__AUTHENTICATION__

Authentication sendiri dalam mini project ini mencakup: 
1. Registrasi
2. Login
3. Refresh token
4. Logout

Empat endpoint ini ditulis di src/authentication/authentication.controller.ts

1. Registration:

<p>Contoh Regsitrasi dengan json:</p>

Pakai Create User DTO:
```
{
	"email": "rainhard@email.com",
	"password": "password"
}
```

Response akan seperti ini:
```
{
	"email": "rainhard@email.com",
	"roles": [
		{
			"id": 4,
			"roleName": "GUEST",
			"createdAt": "2025-04-22T16:35:27.802Z",
			"updatedAt": "2025-04-22T16:35:27.802Z",
			"deletedAt": null
		}
	],
	"id": 11,
	"isActive": false,
	"createdAt": "2025-04-24T05:42:57.867Z",
	"updatedAt": "2025-04-24T05:42:57.867Z",
	"deletedAt": null
}
```
Catatan: Penulis mengasumsikan bahwa siapa saja yang registrasi dan belum menjadi __member__ maka dia hanya seorang tamu (<i>guest</i>).


  2. Login:
Untuk login seorang user bisa memberikan credential seperti "email" dan "password" sebaaimana contoh di bawah ini:
```
{
	"email": "user5@example.com",
	"password": "password" (di database tersimpan sebagai hashed password)
}

```
Responsnya akan seperti ini:
```
{
	"Message": "user is successfully logged in",
	"data": {
		"email": "user5@example.com",
		"roles": [
			"MEMBER"
		]
	},
	"Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoidXNlcjVAZXhhbXBsZS5jb20iLCJyb2xlIjpbIk1FTUJFUiJdLCJpYXQiOjE3NDU0Njc2OTksImV4cCI6MTc0NTQ2Nzg3OX0.v4KdDZqsc4erTlzZjaZCooYdQ53UtQl8dJwHD6KeyGY"
}
```

#
**BORROWING**

Borrowing sendiri dimaksudkan sebagai seorang member bisa:
1. Meminjam buku
2. Melihat buku yang tengah ia pinjam 

Menjalankan nomor 1 berarti: menempatkan id buku sebagai param (request param) dan seorang user yang sedang meminjma diidentifikasi dengan statusnya apakah ia login atau tidak via jwt decoded yang sebelumnya disimpan dengan __request['user'] = payload;__.

Contoh kode dalam file borrowings.controller.ts:
```
  @Post(':bookId')
  @Roles('MEMBER')
  async borrowABook(@Param('bookId')bookId: number, @User() user, @Res() res){
    this.logger.log(`User in borrowing book controller ${JSON.stringify(user)}`)

    const userId = user.id;
    const borrowedBook = await this.borrowService.borrowBooks(userId, bookId);

    res.status(200)
    .json({
      message: 'User just borrow a book',
      book_title: borrowedBook.book.title
    });
  }
```

Respons:

```
{
	"message": "User just borrow a book",
	"book_title": "Introduction to Algorithms"
}
```

Untuk nomor dua sendiri dilakukan dengan ini:
1. User hit endpoint localhost:3000/api/v1/borrowings/me
2. User memiliki identitas tambahan seperti JWT
3. Dan karenanya sistem tahu bahwa: user dengan identitas demikian, demikian, dan demikian telah meminjam buku, misalnya, Introduction to Algorithms. 

Contoh response:
```
[
	{
		"borrowedAt": "2025-04-23T19:46:18.000Z",
		"user_id": 1,
		"book_id": 1,
		"returnedAt": null,
		"dueDate": "2025-05-07T19:46:18.000Z",
		"status": "borrowed",
		"book": {
			"id": 1,
			"title": "Introduction to Algorithms",
			"publisher": null,
			"stock": 5,
			"publishedYear": 2020,
			"isAvailable": true,
			"createdAt": "2025-04-23T13:12:45.087Z",
			"updatedAt": "2025-04-23T13:12:45.087Z",
			"deletedAt": null
		}
	}
]
```
#
__REDIS__

Untuk redis sendiri penulis gunakan untuk __caching__ suatu endpoint yang bertugas untuk mencari buku berdasarkan nama penulis. 

Cara menjalankan REDIS
```bash
brew services start redis #Untuk jalankan redis
brew services stop redis #Untuk menghentikan redis
```

Jika redis sudah jalan, masuklah ke dalam endpoint __localhost:3000/api/{{ _.dot }}/books/search?authorName=rainhard__. Hasil pencarian akan ditapung oleh redis sehingga klik/hit berikutnya akan terasa lebih cepat daripada klik/hit pada waktu pertama kali. 

#
**Query SQL untuk Insert Data Dummy**

**Insert users**

```
INSERT INTO `users` (`password`, `is_active`, `created_at`, `updated_at`, `deleted_at`, `email`) VALUES

('$2a$12$vHCXpQVudSFDQo1oBfzepOlD2vNBIHEgeRjJHRdgSNI2dLIrR055W', 1, NOW(), NOW(), NULL, 'user1@example.com'),

('$2a$12$vHCXpQVudSFDQo1oBfzepOlD2vNBIHEgeRjJHRdgSNI2dLIrR055W', 1, NOW(), NOW(), NULL, 'user2@example.com'),

('$2a$12$vHCXpQVudSFDQo1oBfzepOlD2vNBIHEgeRjJHRdgSNI2dLIrR055W', 1, NOW(), NOW(), NULL, 'user3@example.com'),

('$2a$12$vHCXpQVudSFDQo1oBfzepOlD2vNBIHEgeRjJHRdgSNI2dLIrR055W', 1, NOW(), NOW(), NULL, 'user4@example.com'),

('$2a$12$vHCXpQVudSFDQo1oBfzepOlD2vNBIHEgeRjJHRdgSNI2dLIrR055W', 1, NOW(), NOW(), NULL, 'user5@example.com');
```

**Insert Roles**
```
INSERT INTO `roles` (`id`, `role_name`) VALUES 
(1, 'LIBRARIAN'),
(2, 'ADMIN'),
(3, 'MEMBER'),
(4, 'GUEST');  
```


**INSERT USERS ROLE** 
```
INSERT INTO
  `user_roles` (`user_id`, `role_id`)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);
```