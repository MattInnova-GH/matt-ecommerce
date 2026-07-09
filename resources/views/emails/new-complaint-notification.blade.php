<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Nuevo reclamo recibido</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">Se registró un nuevo {{ strtolower($complaint->complaint_type) }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Un cliente registró un {{ strtolower($complaint->complaint_type) }} en el Libro de Reclamaciones
                                con el código <strong>{{ $complaint->code }}</strong>. Por ley (Ley N° 29571), tienen un plazo
                                máximo de <strong>30 días calendario</strong> para responder.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:16px;">
                                <tr>
                                    <td style="font-size:12px; color:#6b7280; padding:6px 0;">Cliente</td>
                                    <td align="right" style="font-size:13px; padding:6px 0;">{{ $complaint->first_name }} {{ $complaint->last_name }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:12px; color:#6b7280; padding:6px 0; border-top:1px solid #f3f4f6;">Documento</td>
                                    <td align="right" style="font-size:13px; padding:6px 0; border-top:1px solid #f3f4f6;">{{ $complaint->document_number }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:12px; color:#6b7280; padding:6px 0; border-top:1px solid #f3f4f6;">Correo</td>
                                    <td align="right" style="font-size:13px; padding:6px 0; border-top:1px solid #f3f4f6;">{{ $complaint->email }}</td>
                                </tr>
                                @if ($complaint->phone)
                                    <tr>
                                        <td style="font-size:12px; color:#6b7280; padding:6px 0; border-top:1px solid #f3f4f6;">Teléfono</td>
                                        <td align="right" style="font-size:13px; padding:6px 0; border-top:1px solid #f3f4f6;">{{ $complaint->phone }}</td>
                                    </tr>
                                @endif
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

                            <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Detalle del problema:</p>
                            <p style="margin:0 0 16px; font-size:13px; line-height:1.5; background:#f9fafb; border-radius:8px; padding:12px;">{{ $complaint->problem_description }}</p>

                            <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Pedido del consumidor:</p>
                            <p style="margin:0 0 24px; font-size:13px; line-height:1.5; background:#f9fafb; border-radius:8px; padding:12px;">{{ $complaint->consumer_request }}</p>

                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color:#111827; border-radius:8px;">
                                        <a href="{{ url('/admin/complaints') }}" style="display:inline-block; padding:10px 20px; font-size:13px; color:#ffffff; text-decoration:none;">
                                            Ver en el panel de administración
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
