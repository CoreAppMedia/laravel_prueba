<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Este correo electrónico se envía cuando un usuario se registra exitosamente.
 * (This email is sent when a user registers successfully.)
 */
class RegistrationSuccess extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance. (Crear una nueva instancia del mensaje.)
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Get the message envelope. (Obtener el envoltorio del mensaje.)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenido a CoreAppmedia - Registro Exitoso',
        );
    }

    /**
     * Get the message content. (Obtener el contenido del mensaje.)
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.registration_success',
        );
    }

    /**
     * Get the attachments for the message. (Obtener los archivos adjuntos para el mensaje.)
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
