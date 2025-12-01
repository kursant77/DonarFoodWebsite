// client/src/pages/Policy.tsx
import React from "react";

const Policy = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-12">
      {/* FOYDALANISH SHARTLARI */}
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          FOYDALANISH SHARTLARI
        </h1>

        <p className="text-muted-foreground">
          Amal qiladi:{" "}
          <span className="text-primary font-semibold">donerfood.uz</span>{" "}
          saytida
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              1. UMUMIY MA'LUMOT
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">1.1.</strong> Ushbu
                Foydalanish shartlari (Shartlar) donerfood.uz saytining barcha
                foydalanuvchilari uchun majburiy hisoblanadi.
              </p>
              <p>
                <strong className="text-foreground">1.2.</strong> Saytdan
                foydalanish orqali foydalanuvchi ushbu Shartlarga to'liq rozilik
                bildirgan hisoblanadi.
              </p>
              <p>
                <strong className="text-foreground">1.3.</strong> Agar
                foydalanuvchi ushbu Shartlar bilan rozi bo'lmasa, sayt
                xizmatlaridan foydalanmasligi kerak.
              </p>
              <p>
                <strong className="text-foreground">1.4.</strong> donerfood.uz —
                onlayn tarzda ovqat buyurtma berish va yetkazib berish xizmatini
                taqdim etuvchi platforma hisoblanadi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              2. SAYTDAN FOYDALANISH QOIDALARI
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">2.1.</strong> Foydalanuvchi
                saytdan faqat qonuniy maqsadlarda foydalanishi kerak.
              </p>
              <p>
                <strong className="text-foreground">2.2.</strong> Foydalanuvchi
                buyurtma berishda o'zining haqiqiy ism-familiyasi, aloqa raqami
                va manzilini kiritishi shart.
              </p>
              <p>
                <strong className="text-foreground">2.3.</strong> Noto'g'ri
                ma'lumot kiritish yoki yolg'on buyurtma berish holatlari
                aniqlansa, foydalanuvchi donerfood.uz xizmatlaridan vaqtincha
                yoki butunlay chetlashtirilishi mumkin.
              </p>
              <p>
                <strong className="text-foreground">2.4.</strong> Foydalanuvchi
                saytning texnik tizimiga zarar yetkazuvchi harakatlarni
                (xakerlik, zararli dastur joylash, trafikni buzish va hokazo)
                amalga oshirmasligi kerak.
              </p>
              <p>
                <strong className="text-foreground">2.5.</strong> Sayt
                ma'muriyati har qanday noqonuniy faoliyatni aniqlasa, tegishli
                huquqiy chora ko'rish huquqiga ega.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              3. BUYURTMALAR VA TO'LOVLAR
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">3.1.</strong> Buyurtma faqat
                foydalanuvchi tomonidan taqdim etilgan to'liq va aniq
                ma'lumotlar asosida qabul qilinadi.
              </p>
              <p>
                <strong className="text-foreground">3.2.</strong> donerfood.uz
                buyurtmani tasdiqlashdan oldin foydalanuvchiga telefon orqali
                bog'lanib, ma'lumotlarni aniqlashtirishi mumkin.
              </p>
              <p>
                <strong className="text-foreground">3.3.</strong> To'lov
                usullari (naqd, karta orqali yoki boshqa shakllar) sayt
                tomonidan belgilangan tartibda amalga oshiriladi.
              </p>
              <p>
                <strong className="text-foreground">3.4.</strong> Noto'g'ri
                ma'lumotlar sababli buyurtmaning bekor qilinishi uchun sayt
                ma'muriyati javobgar bo'lmaydi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              4. MAXFIYLIK VA MA'LUMOTLARNI HIMOYA QILISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">4.1.</strong>{" "}
                Foydalanuvchilarning shaxsiy ma'lumotlari Maxfiylik siyosati
                asosida yig'iladi va himoya qilinadi.
              </p>
              <p>
                <strong className="text-foreground">4.2.</strong> Sayt SSL
                sertifikati va HTTPS protokoli orqali himoyalangan,
                foydalanuvchi ma'lumotlari shifrlangan holda uzatiladi.
              </p>
              <p>
                <strong className="text-foreground">4.3.</strong> Batafsil
                ma'lumot uchun foydalanuvchi "Maxfiylik siyosati" bo'limi bilan
                tanishib chiqishi kerak.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              5. MUALLIFLIK HUQUQI VA KONTENTDAN FOYDALANISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">5.1.</strong> donerfood.uz
                saytida joylashtirilgan barcha materiallar — logotip, matn,
                dizayn, rasm, kod, brend elementi va boshqa kontent — mualliflik
                huquqi bilan himoyalangan.
              </p>
              <p>
                <strong className="text-foreground">5.2.</strong> Ushbu
                materiallarni ruxsatsiz ko'chirish, nusxalash, tarqatish yoki
                boshqa saytlarda joylashtirish qat'iyan taqiqlanadi.
              </p>
              <p>
                <strong className="text-foreground">5.3.</strong> Sayt
                materiallaridan foydalanish faqat donerfood.uz ma'muriyatining
                yozma ruxsati bilan amalga oshirilishi mumkin.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              6. JAVOBGARLIK CHEKLASH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">6.1.</strong> donerfood.uz
                foydalanuvchi tomonidan kiritilgan noto'g'ri ma'lumotlar yoki
                noto'g'ri yetkazilgan buyurtmalar uchun javobgar emas.
              </p>
              <p>
                <strong className="text-foreground">6.2.</strong> Sayt texnik
                nosozliklar, internet uzilishlari yoki uchinchi tomon
                xizmatlaridagi muammolar sababli yuzaga kelgan kechikishlar
                uchun javobgar bo'lmasligi mumkin.
              </p>
              <p>
                <strong className="text-foreground">6.3.</strong> Foydalanuvchi
                o'z hisobiga (agar mavjud bo'lsa) va saytdagi harakatlariga
                shaxsan javobgar.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              7. O'ZGARTIRISHLAR KIRITISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">7.1.</strong> donerfood.uz
                ushbu Foydalanish shartlarini istalgan vaqtda yangilash yoki
                o'zgartirish huquqiga ega.
              </p>
              <p>
                <strong className="text-foreground">7.2.</strong> Yangilangan
                versiyalar sayt sahifasida e'lon qilinadi va e'lon qilingan
                paytdan boshlab kuchga kiradi.
              </p>
              <p>
                <strong className="text-foreground">7.3.</strong>{" "}
                Foydalanuvchilar Shartlardagi o'zgarishlarni muntazam ravishda
                kuzatib borishlari tavsiya etiladi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAXFIYLIK SIYOSATI */}
      <section className="space-y-6 pt-12 border-t">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          MAXFIYLIK SIYOSATI
        </h1>

        <p className="text-muted-foreground">
          Amal qiladi:{" "}
          <span className="text-primary font-semibold">donerfood.uz</span>{" "}
          saytida
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              1. UMUMIY QOIDALAR
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">1.1.</strong> Ushbu
                Maxfiylik siyosati donerfood.uz foydalanuvchilari tomonidan
                taqdim etilgan shaxsiy ma'lumotlarni yig'ish, saqlash va
                ishlatish tartibini belgilaydi.
              </p>
              <p>
                <strong className="text-foreground">1.2.</strong> Sayt orqali
                buyurtma berish yoki ro'yxatdan o'tish jarayonida foydalanuvchi
                ushbu siyosat shartlariga rozilik bildiradi.
              </p>
              <p>
                <strong className="text-foreground">1.3.</strong> donerfood.uz
                ma'muriyati foydalanuvchi ma'lumotlarini himoya qilishni o'z
                zimmasiga oladi va ularni uchinchi shaxslarga qonunda
                belgilangan hollardan tashqari taqdim etmaydi.
              </p>
              <p>
                <strong className="text-foreground">1.4.</strong> Sayt SSL
                sertifikati va HTTPS protokoli orqali ishlaydi, bu foydalanuvchi
                ma'lumotlarini xavfsiz va shifrlangan tarzda uzatishni
                ta'minlaydi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              2. MA'LUMOTLARNI YIG'ISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">2.1.</strong> donerfood.uz
                faqat foydalanuvchi o'zi rozilik bergan taqdirda shaxsiy
                ma'lumotlarni qabul qiladi.
              </p>
              <p>
                <strong className="text-foreground">2.2.</strong> Quyidagi
                ma'lumotlar yig'ilishi mumkin:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Ism va familiya;</li>
                <li>Telefon raqami;</li>
                <li>Yetkazib berish manzili.</li>
              </ul>
              <p>
                <strong className="text-foreground">2.3.</strong> Ushbu
                ma'lumotlar faqat buyurtmani qayta ishlash, yetkazib berish va
                foydalanuvchi bilan bog'lanish maqsadida ishlatiladi.
              </p>
              <p>
                <strong className="text-foreground">2.4.</strong> Foydalanuvchi
                tomonidan taqdim etilgan ma'lumotlar uchinchi tomonlarga
                avtomatik tarzda uzatilmaydi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              3. MA'LUMOTLARNI FOYDALANISH TARTIBI
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">3.1.</strong>{" "}
                Foydalanuvchining shaxsiy ma'lumotlari quyidagi hollarda
                ishlatiladi:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Buyurtmani tasdiqlash va yetkazib berish uchun;</li>
                <li>
                  Foydalanuvchi bilan aloqa o'rnatish (masalan, telefon orqali
                  bog'lanish);
                </li>
                <li>Xizmat sifatini yaxshilash va tahlil qilish uchun.</li>
              </ul>
              <p>
                <strong className="text-foreground">3.2.</strong>{" "}
                Foydalanuvchining ma'lumotlari reklama yoki uchinchi shaxslar
                bilan bo'lishish uchun foydalanilmaydi.
              </p>
              <p>
                <strong className="text-foreground">3.3.</strong> Ma'lumotlar
                faqat qonuniy va halol maqsadlarda ishlatiladi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              4. MA'LUMOTLARNI SAQLASH VA HIMOYA QILISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">4.1.</strong> donerfood.uz
                foydalanuvchilarning ma'lumotlarini xavfsiz serverlarda
                saqlaydi.
              </p>
              <p>
                <strong className="text-foreground">4.2.</strong> SSL
                sertifikati orqali foydalanuvchidan serverga uzatiladigan barcha
                ma'lumotlar shifrlangan holda yuboriladi.
              </p>
              <p>
                <strong className="text-foreground">4.3.</strong> Ma'lumotlar
                faqat xizmat ko'rsatish davrida saqlanadi va zarur bo'lmaganda
                o'chiriladi.
              </p>
              <p>
                <strong className="text-foreground">4.4.</strong> Foydalanuvchi
                o'z ma'lumotlarini o'zgartirish yoki o'chirishni so'rash
                huquqiga ega.
              </p>
              <p>
                <strong className="text-foreground">4.5.</strong> Maxfiylik
                siyosatini buzishga urinish aniqlansa, sayt ma'muriyati tegishli
                huquqiy choralar ko'rish huquqiga ega.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              5. FOYDALANUVCHI ROZILIGI
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">5.1.</strong> donerfood.uz
                dan foydalanish orqali foydalanuvchi ushbu Maxfiylik siyosatida
                ko'rsatilgan barcha shartlarga rozilik bildiradi.
              </p>
              <p>
                <strong className="text-foreground">5.2.</strong> Foydalanuvchi
                roziligisiz hech qanday shaxsiy ma'lumot yig'ilmaydi yoki
                ishlatilmaydi.
              </p>
              <p>
                <strong className="text-foreground">5.3.</strong> Agar
                foydalanuvchi ma'lumotlarini taqdim etishni xohlamasa, buyurtma
                joylashtirish xizmati cheklanishi mumkin.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              6. MUALLIFLIK HUQUQI VA KONTENTDAN FOYDALANISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">6.1.</strong> donerfood.uz
                saytida joylashtirilgan barcha materiallar (matnlar, logotip,
                dizayn, rasmlar, kod va boshqa tarkibiy qismlar) mualliflik
                huquqi bilan himoyalangan.
              </p>
              <p>
                <strong className="text-foreground">6.2.</strong> Ushbu
                materiallarni ruxsatsiz ko'chirish, nusxalash, tarqatish yoki
                boshqa sayt va platformalarda foydalanish qat'iyan taqiqlanadi.
              </p>
              <p>
                <strong className="text-foreground">6.3.</strong> Sayt
                ma'muriyati tomonidan yozma ruxsat berilgan hollardagina
                kontentdan foydalanishga yo'l qo'yiladi.
              </p>
              <p>
                <strong className="text-foreground">6.4.</strong> Ushbu
                qoidabuzarliklar qonun doirasida javobgarlikka olib kelishi
                mumkin.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              7. O'ZGARTIRISHLAR KIRITISH
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">7.1.</strong> donerfood.uz
                ma'muriyati ushbu Maxfiylik siyosatini istalgan vaqtda yangilash
                huquqiga ega.
              </p>
              <p>
                <strong className="text-foreground">7.2.</strong>{" "}
                O'zgartirishlar e'lon qilingan paytdan boshlab kuchga kiradi.
              </p>
              <p>
                <strong className="text-foreground">7.3.</strong>{" "}
                Foydalanuvchilar siyosatdagi o'zgarishlarni muntazam ravishda
                kuzatib borishlari tavsiya etiladi.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              8. ALOQA UCHUN MA'LUMOTLAR
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">
                +998 91 985 95 95
              </p>
              <p>
                Agar sizda ushbu Maxfiylik siyosatiga oid savollar bo'lsa,
                quyidagi manzil orqali murojaat qilishingiz mumkin:
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Policy;
