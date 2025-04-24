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

Catatan: Penulis meletakkan semua *branch* di *development*
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
CONTROLLER (localhost:3000/api/v1/)

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
