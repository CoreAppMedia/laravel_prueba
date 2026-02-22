<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Restablecer Contraseña</title>
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
            text-align: center;
        }
        .content h2 {
            color: #2d3748;
            margin-top: 0;
        }
        .code-box {
            background-color: #edf2f7;
            padding: 20px;
            border-radius: 6px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #2d3748;
            border: 2px dashed #cbd5e0;
        }
        .footer {
            background-color: #edf2f7;
            color: #718096;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .note {
            font-size: 14px;
            color: #718096;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CoreAppmedia</h1>
        </div>
        <div class="content">
            <h2>Restablecimiento de Contraseña</h2>
            <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de seguridad para continuar:</p>
            
            <div class="code-box">
                {{ $code }}
            </div>

            <p class="note">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} CoreAppmedia. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
