<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reclamo recibido</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">Hemos recibido tu {{ strtolower($complaint->complaint_type) }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Hola {{ $complaint->first_name }}, confirmamos la recepción de tu {{ strtolower($complaint->complaint_type) }}
                                con el código <strong>{{ $complaint->code }}</strong>, conforme al Libro de Reclamaciones
                                establecido por el Código de Protección y Defensa del Consumidor – Ley N° 29571.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:16px;">
                                <tr>
                                    <td style="font-size:12px; color:#6b7280; padding:6px 0;">Tipo</td>
                                    <td align="right" style="font-size:13px; padding:6px 0;">{{ $complaint->complaint_type }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:12px; color:#6b7280; padding:6px 0; border-top:1px solid #f3f4f6;">Bien contratado</td>
                                    <td align="right" style="font-size:13px; padding:6px 0; border-top:1px solid #f3f4f6;">{{ $complaint->asset_description }}</td>
                                </tr>
                                @if ($complaint->claimed_amount)
                                    <tr>
                                        <td style="font-size:12px; color:#6b7280; padding:6px 0; border-top:1px solid #f3f4f6;">Monto reclamado</td>
                                        <td align="right" style="font-size:13px; padding:6px 0; border-top:1px solid #f3f4f6;">S/ {{ number_format($complaint->claimed_amount, 2) }}</td>
                                    </tr>
                                @endif
                            </table>

                            <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Detalle registrado:</p>
                            <p style="margin:0 0 16px; font-size:13px; line-height:1.5; background:#f9fafb; border-radius:8px; padding:12px;">{{ $complaint->problem_description }}</p>

                            <p style="margin:0; font-size:13px; color:#6b7280;">
                                Conforme al Código de Protección y Defensa del Consumidor, tenemos un plazo máximo de
                                <strong>30 días calendario</strong> para dar respuesta a tu {{ strtolower($complaint->complaint_type) }}.
                                Nos pondremos en contacto contigo antes de ese plazo para darle seguimiento.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f9fafb; padding:16px 32px; font-size:12px; color:#9ca3af;">
                            Si tienes alguna duda, escríbenos por WhatsApp o responde a este correo.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
