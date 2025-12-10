// Referensi.jsx

import React from 'react';
import { Briefcase, Percent, Building, BookOpen, ExternalLink, Globe, Plane } from 'lucide-react';
import "../index.css";

const Referensi = () => {
    const dataReferensi = [
        { 
            id: 'umum',
            name: 'Dasar Hukum PPh & HPP', 
            desc: 'Regulasi fundamental dan Undang-Undang Dasar hukum pengenaan Pajak Penghasilan di Indonesia.', 
            icon: <BookOpen />,
            color: 'blue',
            link: null,
        },
        {
            id: 'pph21',
            name: 'PPh Pasal 21', 
            desc: 'Informasi dan Regulasi resmi dari DJP terkait Pajak Penghasilan Pasal 21 (Gaji Karyawan).', 
            icon: <Briefcase />,
            color: 'green',
            link: "https://pajak.go.id/id/pph-pasal-2126",
        },
        {
            id: 'pph23',
            name: 'PPh Pasal 23', 
            desc: 'Informasi dan Regulasi resmi dari DJP terkait Pemotongan PPh Pasal 23 (Jasa, Sewa, Dividen).', 
            icon: <Percent />,
            color: 'purple',
            link: "https://www.pajak.go.id/id/pemotongan-pajak-penghasilan-pasal-23",
        },
        {
            id: 'pph42',
            name: 'PPh Pasal 4(2) Final', 
            desc: 'Informasi dan Regulasi resmi dari DJP terkait PPh Final (Sewa Tanah/Bangunan, dll.).', 
            icon: <Building />,
            color: 'orange',
            link: "https://pajak.go.id/id/pph-pasal-4-ayat-2",
        },
        {
            id: 'pph22',
            name: 'PPh Pasal 22', 
            desc: 'Informasi dan Regulasi resmi dari DJP terkait PPh Pasal 22 (Impor dan Bendahara).', 
            icon: <Globe />,
            color: 'yellow',
            link: "https://pajak.go.id/id/pph-pasal-22",
        },
        {
            id: 'pph15',
            name: 'PPh Pasal 15', 
            desc: 'Informasi dan Regulasi resmi dari DJP terkait PPh Pasal 15 (Pelayaran, Penerbangan, dll).', 
            icon: <Plane />,
            color: 'pink',
            link: "https://www.pajak.go.id/id/pph-pasal-15",
        }
    ];

    return (
        <div className="referensi-container">
            <h2 className="section-header">Daftar Referensi & Regulasi</h2>
            
            <div className="tax-list reference-list">
                {dataReferensi.map((ref) => (
                    <a 
                        key={ref.id}
                        href={ref.link ? ref.link : '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`tax-card ${ref.color} referensi-card ${ref.link ? '' : 'no-link'}`} 
                    >
                        <div className="icon">
                            {ref.icon}
                        </div>
                        <div className="text">
                            <h3>{ref.name}</h3>
                            <p>
                                {ref.desc}
                            </p>
                        </div>
                        {ref.link && (
                            <div className="arrow link-icon">
                                <ExternalLink size={22} /> 
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Referensi;