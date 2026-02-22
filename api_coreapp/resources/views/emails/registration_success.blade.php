<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenido a CoreAppmedia</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #2d3748;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
            color: #4a5568;
            line-height: 1.6;
        }
        .content h2 {
            color: #2d3748;
            margin-top: 0;
        }
        .details {
            background-color: #edf2f7;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .details p {
            margin: 5px 0;
            font-weight: bold;
        }
        .details span {
            font-weight: normal;
        }
        .footer {
            background-color: #edf2f7;
            color: #718096;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background-color: #4299e1;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
        }
        .btn:hover {
            background-color: #3182ce;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CoreAppmedia</h1>
        </div>
        <div class="content">
            <h2>¡Bienvenido, {{ $user->nombre }}!</h2>
            <p>Tu registro en nuestra plataforma ha sido exitoso. Estamos encantados de tenerte con nosotros.</p>
            
            <div class="details">
                <p>Nombre Completo: <span>{{ $user->nombre }} {{ $user->apellido_paterno }} {{ $user->apellido_materno }}</span></p>
                <p>Correo Electrónico: <span>{{ $user->email }}</span></p>
            </div>

            <p>Ahora puedes acceder a todas las funcionalidades de CoreAppmedia.</p>
            
            <center>
                <a href="#" class="btn">Ir a la Plataforma</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} CoreAppmedia. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
