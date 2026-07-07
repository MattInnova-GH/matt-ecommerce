<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Actualización de tu pedido</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#111827; padding:24px 32px;">
                            <h1 style="margin:0; color:#ffffff; font-size:20px;">Tu pedido está {{ $statusLabel }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                Hola {{ $order->user->first_name }}, el estado de tu pedido
                                <strong>{{ $order->order_number }}</strong> cambió a
                                <strong>{{ $statusLabel }}</strong>.
                            </p>

                            @if ($order->status === 'ACCEPTED')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Verificamos tu pago y ya estamos preparando tu pedido.
                                </p>
                            @elseif ($order->status === 'SHIPPED')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Tu pedido va en camino.
                                </p>
                            @elseif ($order->status === 'DELIVERED')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Tu pedido fue entregado. ¡Gracias por tu compra!
                                </p>
                            @elseif ($order->status === 'REJECTED')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    No pudimos verificar el pago de tu pedido. Si crees que esto es un error,
                                    escríbenos por WhatsApp.
                                </p>
                            @elseif ($order->status === 'CANCELLED')
                                <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
                                    Tu pedido fue cancelado.
                                </p>
                            @endif

                            @if (in_array($order->status, ['REJECTED', 'CANCELLED']) && $order->rejection_reason)
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2; border-radius:8px; margin-bottom:16px;">
                                    <tr>
                                        <td style="padding:12px 16px;">
                                            <p style="margin:0 0 4px; font-size:12px; font-weight:bold; color:#991b1b; text-transform:uppercase;">Motivo</p>
                                            <p style="margin:0; font-size:14px; line-height:1.5; color:#7f1d1d;">{{ $order->rejection_reason }}</p>
                                        </td>
                                    </tr>
                                </table>
                            @endif

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

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-size:15px; font-weight:bold; padding:8px 0;">Total</td>
                                    <td align="right" style="font-size:15px; font-weight:bold; padding:8px 0;">S/ {{ number_format($order->total, 2) }}</td>
                                </tr>
                            </table>
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
