<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reembolso procesado</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">Tu reembolso fue procesado</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Hola {{ $payment->order->user->first_name }}, te confirmamos que ya procesamos la
                                devolución del pago de tu pedido <strong>{{ $payment->order->order_number }}</strong>
                                por un total de <strong>S/ {{ number_format($payment->amount, 2) }}</strong>.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4; border-radius:8px; margin-bottom:16px;">
                                <tr>
                                    <td style="padding:12px 16px;">
                                        <p style="margin:0 0 4px; font-size:12px; font-weight:bold; color:#166534; text-transform:uppercase;">Detalle del reembolso</p>
                                        <p style="margin:0; font-size:14px; line-height:1.5; color:#14532d;">{{ $payment->refund_notes }}</p>
                                    </td>
                                </tr>
                            </table>

                            @if ($payment->refund_proof_url)
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Puedes ver el comprobante de la devolución aquí:
                                    <a href="{{ asset('storage/'.$payment->refund_proof_url) }}" style="color:#2563eb;">Ver comprobante</a>
                                </p>
                            @endif

                            <p style="margin:0; font-size:14px; line-height:1.5;">
                                Si tienes alguna duda sobre esta devolución, escríbenos por WhatsApp o responde a este correo.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f9fafb; padding:16px 32px; font-size:12px; color:#9ca3af;">
                            Gracias por tu paciencia.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
