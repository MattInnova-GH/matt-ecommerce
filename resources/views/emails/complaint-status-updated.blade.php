<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Actualización de tu reclamo</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">Tu {{ strtolower($complaint->complaint_type) }} cambió de estado</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Hola {{ $complaint->first_name }}, te informamos que tu {{ strtolower($complaint->complaint_type) }}
                                con el código <strong>{{ $complaint->code }}</strong> ahora está en estado:
                            </p>

                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                                <tr>
                                    <td style="background-color:#111827; border-radius:999px; padding:8px 18px;">
                                        <span style="font-size:13px; font-weight:bold; color:#ffffff;">{{ $statusLabel }}</span>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Bien contratado:</p>
                            <p style="margin:0 0 16px; font-size:13px; line-height:1.5; background:#f9fafb; border-radius:8px; padding:12px;">{{ $complaint->asset_description }}</p>

                            @if ($complaint->status === 'resuelto')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Hemos dado por resuelto tu caso. Si tienes alguna duda adicional, escríbenos por WhatsApp o responde a este correo.
                                </p>
                            @else
                                <p style="margin:0; font-size:14px; line-height:1.5;">
                                    Seguimos trabajando en tu caso. Conforme al Código de Protección y Defensa del Consumidor – Ley N° 29571,
                                    tenemos un plazo máximo de <strong>30 días calendario</strong> desde tu solicitud para darte una respuesta final.
                                </p>
                            @endif
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
