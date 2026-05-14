import React, { useState } from 'react';

const secenekler = [
  { ad: 'Taş', emoji: '✊' },
  { ad: 'Kağıt', emoji: '🖐️' },
  { ad: 'Makas', emoji: '✌️' }
];

function App() {
  const [kullaniciSecimi, setKullaniciSecimi] = useState(null);
  const [bilgisayarSecimi, setBilgisayarSecimi] = useState(null);
  const [sonuc, setSonuc] = useState('');
  const [kullaniciPuan, setKullaniciPuan] = useState(0);
  const [bilgisayarPuan, setBilgisayarPuan] = useState(0);
  const [oyunBitti, setOyunBitti] = useState(false);
  
  // YENİ: Hamle geçmişini tutacağımız dizi state'i
  const [gecmis, setGecmis] = useState([]);
  // YENİ: Karanlık mod state'i
  const [karanlikMod, setKaranlikMod] = useState(false);

  const oyna = (secimObj) => {
    if (oyunBitti) return;

    const rastgeleIndex = Math.floor(Math.random() * 3);
    const pcSecimi = secenekler[rastgeleIndex];
    
    setKullaniciSecimi(secimObj);
    setBilgisayarSecimi(pcSecimi);

    let guncelKullaniciPuan = kullaniciPuan;
    let guncelBilgisayarPuan = bilgisayarPuan;
    let turSonucMesaji = '';

    if (secimObj.ad === pcSecimi.ad) {
      turSonucMesaji = 'Berabere';
    } else if (
      (secimObj.ad === 'Taş' && pcSecimi.ad === 'Makas') ||
      (secimObj.ad === 'Kağıt' && pcSecimi.ad === 'Taş') ||
      (secimObj.ad === 'Makas' && pcSecimi.ad === 'Kağıt')
    ) {
      turSonucMesaji = 'Kazandın';
      guncelKullaniciPuan++;
      setKullaniciPuan(guncelKullaniciPuan);
    } else {
      turSonucMesaji = 'Kaybettin';
      guncelBilgisayarPuan++;
      setBilgisayarPuan(guncelBilgisayarPuan);
    }

    setSonuc(turSonucMesaji);

    // YENİ: Her turu geçmiş dizisinin EN BAŞINA ekliyoruz
    const yeniHamle = { 
      tur: gecmis.length + 1, 
      sen: secimObj.emoji, 
      pc: pcSecimi.emoji, 
      durum: turSonucMesaji 
    };
    setGecmis([yeniHamle, ...gecmis]);

    if (guncelKullaniciPuan === 3 || guncelBilgisayarPuan === 3) {
      setOyunBitti(true);
      if (guncelKullaniciPuan === 3) {
        setSonuc('🎉 TEBRİKLER, OYUNU KAZANDIN! 🎉');
      } else {
        setSonuc('💀 BİLGİSAYAR KAZANDI! 💀');
      }
    }
  };

  const oyunuSifirla = () => {
    setKullaniciSecimi(null);
    setBilgisayarSecimi(null);
    setSonuc('');
    setKullaniciPuan(0);
    setBilgisayarPuan(0);
    setOyunBitti(false);
    setGecmis([]); // Geçmişi de sıfırlıyoruz
  };

  // Dinamik arka plan ve metin rengi ayarları
  const temaStili = {
    backgroundColor: karanlikMod ? '#1e1e1e' : '#f4f4f9',
    color: karanlikMod ? '#ffffff' : '#333333',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease' // Yumuşak renk geçişi
  };

  return (
    <div style={temaStili}>
      {/* Tema Değiştirme Butonu */}
      <button 
        onClick={() => setKaranlikMod(!karanlikMod)}
        style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px', borderRadius: '5px', cursor: 'pointer', border: 'none', backgroundColor: karanlikMod ? '#555' : '#ddd', color: karanlikMod ? '#fff' : '#000' }}
      >
        {karanlikMod ? '☀️ Aydınlık Mod' : '🌙 Karanlık Mod'}
      </button>

      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
        <h1>Taş - Kağıt - Makas</h1>
        <p><i>İlk 3 puana ulaşan kazanır!</i></p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', fontSize: '24px', margin: '20px 0' }}>
          <div><p>Sen</p><strong>{kullaniciPuan}</strong></div>
          <div><p>Bilgisayar</p><strong>{bilgisayarPuan}</strong></div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          {secenekler.map((secim) => (
            <button
              key={secim.ad}
              onClick={() => oyna(secim)}
              disabled={oyunBitti}
              style={{ 
                margin: '10px', padding: '15px 25px', fontSize: '20px', 
                cursor: oyunBitti ? 'not-allowed' : 'pointer',
                backgroundColor: oyunBitti ? '#888' : '#007bff',
                color: 'white', border: 'none', borderRadius: '8px', transition: '0.2s'
              }}
            >
              {secim.emoji} {secim.ad}
            </button>
          ))}
        </div>

        {kullaniciSecimi && (
          <div style={{ padding: '20px', border: `2px dashed ${karanlikMod ? '#555' : '#ccc'}`, borderRadius: '15px', marginBottom: '20px' }}>
            <p style={{ fontSize: '20px' }}>Sen: {kullaniciSecimi.emoji} - {bilgisayarSecimi.emoji} :PC</p>
            <h2 style={{ color: oyunBitti ? (kullaniciPuan === 3 ? '#28a745' : '#dc3545') : (karanlikMod ? '#fff' : '#333') }}>
              {sonuc}
            </h2>
            {oyunBitti && (
              <button onClick={oyunuSifirla} style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Yeniden Başlat 🔄
              </button>
            )}
          </div>
        )}

        {/* Hamle Geçmişi Listesi */}
        {gecmis.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: '30px', padding: '15px', backgroundColor: karanlikMod ? '#2d2d2d' : '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', borderBottom: `1px solid ${karanlikMod ? '#555' : '#eee'}`, paddingBottom: '10px' }}>📜 Hamle Geçmişi</h3>
            <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
              {gecmis.map((hamle, index) => (
                <li key={index} style={{ padding: '8px 0', borderBottom: `1px solid ${karanlikMod ? '#444' : '#f0f0f0'}`, fontSize: '16px' }}>
                  <strong>Tur {hamle.tur}:</strong> Sen {hamle.sen} ⚔️ {hamle.pc} PC 👉 <i>{hamle.durum}</i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;