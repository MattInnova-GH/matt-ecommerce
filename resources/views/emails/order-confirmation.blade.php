<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Confirmación de pedido</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">¡Gracias por tu compra, {{ $order->user->name }}!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Hemos recibido tu pedido <strong>{{ $order->order_number }}</strong> y está pendiente de verificación de pago.
                                Te avisaremos en cuanto sea confirmado.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:16px;">
                                <thead>
                                    <tr>
                                        <th align="left" style="font-size:12px; color:#6b7280; padding:8px 0; border-bottom:1px solid #e5e7eb;">Producto</th>
                                        <th align="center" style="font-size:12px; color:#6b7280; padding:8px 0; border-bottom:1px solid #e5e7eb;">Cant.</th>
                                        <th align="right" style="font-size:12px; color:#6b7280; padding:8px 0; border-bottom:1px solid #e5e7eb;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order->items as $item)
                                        <tr>
                                            <td style="font-size:14px; padding:8px 0; border-bottom:1px solid #f3f4f6;">{{ $item->product_name }}</td>
                                            <td align="center" style="font-size:14px; padding:8px 0; border-bottom:1px solid #f3f4f6;">{{ $item->quantity }}</td>
                                            <td align="right" style="font-size:14px; padding:8px 0; border-bottom:1px solid #f3f4f6;">S/ {{ number_format($item->subtotal, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="font-size:15px; font-weight:bold; padding:8px 0;">Total</td>
                                    <td align="right" style="font-size:15px; font-weight:bold; padding:8px 0;">S/ {{ number_format($order->total, 2) }}</td>
                                </tr>
                            </table>

                            <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Método de pago: {{ $order->payment?->method === 'yape' ? 'Yape' : 'Transferencia bancaria' }}</p>
                            @if ($order->shipping_address)
                                <p style="margin:0; font-size:13px; color:#6b7280;">Envío a domicilio.</p>
                            @else
                                <p style="margin:0; font-size:13px; color:#6b7280;">Recojo en tienda.</p>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f9fafb; padding:16px 32px; font-size:12px; color:#9ca3af;">
                            Este es un correo informativo, no lo respondas. Si tienes alguna duda, escríbenos por WhatsApp.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
