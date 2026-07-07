import { useState, useEffect } from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { MapPin, User, Phone } from 'lucide-react';
import MapPicker from './MapPicker';

export function DeliveryForm() {
    const { setDeliveryAddress, isTransferModalOpen, isYapeModalOpen } =
        useCheckoutStore();
    const isAnyModalOpen = isTransferModalOpen || isYapeModalOpen;

    const [coords, setCoords] = useState({ lat: -12.0464, lng: -77.0428 });
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [reference, setReference] = useState('');
    const [phone, setPhone] = useState('');
    const [recipientName, setRecipientName] = useState('');

    useEffect(() => {
        if (address && district && postalCode && phone && recipientName) {
            setDeliveryAddress({
                lat: coords.lat,
                lng: coords.lng,
                address,
                district,
                postalCode,
                reference,
                phone,
                recipientName,
            });
        }
    }, [
        coords,
        address,
        district,
        postalCode,
        reference,
        phone,
        recipientName,
        setDeliveryAddress,
    ]);

    return (
        <div className="space-y-5 border-t border-gray-100 pt-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <MapPin size={16} className="text-gray-400" />
                Datos de entrega
            </p>

            {/* Mapa oculto con visibility cuando hay modal abierto */}
            <div
                className="h-[280px] overflow-hidden rounded-xl border border-gray-200"
                style={{ visibility: isAnyModalOpen ? 'hidden' : 'visible' }}
            >
                <MapPicker
                    lat={coords.lat}
                    lng={coords.lng}
                    onLocationChange={(lat, lng, addr) => {
                        setCoords({ lat, lng });
                        if (addr) setAddress(addr);
                    }}
                />
            </div>

            <p className="-mt-2 text-xs text-gray-400">
                Arrastra el marcador para ajustar la ubicación exacta
            </p>

            {/* Campos del formulario — sin cambios */}
            <div className="space-y-3">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                        Dirección de entrega *
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Av. Javier Prado 1234, San Isidro"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                            Distrito *
                        </label>
                        <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="Ej: San Isidro"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                            Código postal *
                        </label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) =>
                                setPostalCode(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 5),
                                )
                            }
                            inputMode="numeric"
                            placeholder="Ej: 15046"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                        Referencia (opcional)
                    </label>
                    <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ej: Frente al parque, edificio azul"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                            <User size={12} className="mr-1 inline" />
                            Nombre del destinatario *
                        </label>
                        <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Nombre completo"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                            <Phone size={12} className="mr-1 inline" />
                            Teléfono de contacto *
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="987 654 321"
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
