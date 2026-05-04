// 9 Additional New Pro Books
// Original stories for learners

import { ProBook } from './proBooksData';
import { COVER_STYLES } from '../components/BookCover';

export const NEW_PRO_BOOKS_2: ProBook[] = [
  {
    id: 11,
    title: "Skybound",
    author: "YDS PRO",
    cover: "✈️",
    coverStyle: COVER_STYLES.midnight,
    level: "B2",
    description: "Genç bir pilot adayı ve ilk solo uçuşunun hikayesi. Cesaret ve sorumluluk temaları.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Pre-Flight",
        content: `Arda'nın elleri titriyordu. Bugün ilk solo uçuşunu yapacaktı. Eğitmeni Elif ona son kontrolleri gösterdi.

"Unutma," dedi Elif, "gökyüzünde tek başınasın ama tüm kurallar senin yanında."

Arda uçağın etrafında dolaştı, kanatları, pervaneyi, yakıtı kontrol etti. Çocukluğundan beri hayali buydu: gökyüzünde özgür olmak.`
      },
      {
        id: 2,
        title: "Chapter 2: Takeoff",
        content: `Kuleden izin geldi: "TC-ARD, kalkışa hazırsanız pist 18 serbest."

Arda gazı açtı. Uçak hızlandı, pist altından akıp gitti. Hız göstergesi V1'e geldi, sonra rotate. Burnu hafifçe kaldırdı ve... havadaydı.

Aşağıda dünya küçülüyor, gökyüzü açılıyordu. Kulaklığından Elif'in sesi geldi: "Harika gidiyorsun. Rota 090, 3000 feet."`
      },
      {
        id: 3,
        title: "Chapter 3: Landing",
        content: `En zor kısım inişti. Rüzgar hafif yan esiyordu. Arda flap'leri ayarladı, hızı düşürdü. Pist uzakta bir çizgi gibi görünüyordu.

"İniş açılarını koru," dedi Elif. "Hafif dokunuş."

Uçak piste yumuşakça değdi. Lastikler hafif bir ses çıkardı. Arda frenleri uyguladı ve uçağı durdurdu.

Kule: "TC-ARD, tebrikler, ilk solo uçuşunu tamamladın." Arda'nın yüzü gülümsedi. Gökyüzü artık onun eviydi.`
      }
    ]
  },
  {
    id: 12,
    title: "Code Red",
    author: "YDS PRO",
    cover: "🧑‍💻",
    coverStyle: COVER_STYLES.neon,
    level: "C1",
    description: "Bir siber güvenlik uzmanının kritik bir saldırıyı durdurma yarışı. Teknik terimler açıklamalı.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Breach",
        content: `Saat 03:17. SOC ekranları kırmızı alarm verdi. "Critical alert: East Data Center anomaly."

Selin klavyesine uzandı, logları açtı. Anormal trafik, bilinmeyen IP'ler, hızla çoğalan bağlantılar. DDoS değildi, daha zekice bir şeydi.

"Bu bir lateral movement," dedi. "İçeriden yayılıyor."`
      },
      {
        id: 2,
        title: "Chapter 2: Containment",
        content: `Selin segmentasyonu başlattı. Zero Trust politikalarını devreye aldı. Kimlik bazlı erişimleri kapattı, MFA zorunlu kıldı.

Takım lideri: "Ne kadar süremiz var?"

"Dakikalar," dedi Selin. "Eğer domain controller'a ulaşırlar ise her şey biter."

O sırada SIEM'de yeni bir uyarı: "Privilege escalation attempt blocked." Selin doğru yoldaydı.`
      },
      {
        id: 3,
        title: "Chapter 3: Root Cause",
        content: `Saldırı durdurulduktan sonra asıl soru geldi: "Nasıl girdiler?"

Selin forensik analiz yaptı. Loglarda bir e-posta eki gördü. Yeni başlayan bir çalışanın açtığı sahte PDF. İçinde macro exploit. Sonra C2 bağlantısı.

"En zayıf halka yine insan," dedi. "Eğitim, farkındalık, ve sıkı e-posta filtreleri. Aksi halde savunma zinciri kırılıyor."`
      }
    ]
  },
  {
    id: 13,
    title: "Desert Stars",
    author: "YDS PRO",
    cover: "🏜️",
    coverStyle: COVER_STYLES.autumn,
    level: "B1",
    description: "Bir çöl kanyonunda mahsur kalan iki kardeşin hayatta kalma hikayesi.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Wrong Turn",
        content: `Mert ve ablası Aysu kamp yapmayı seviyordu. Ama bu kez GPS sinyal kaybetti, patikayı şaşırdılar. Çöl güneşi tepede, su azalıyordu.

"Kanyonun içine inelim," dedi Mert. "Gölgede kalırız." İndiler ama yukarı çıkış yolu dik ve kaygan görünüyordu.`
      },
      {
        id: 2,
        title: "Chapter 2: Night Cold",
        content: `Gündüz sıcağından sonra gece soğuk vurdu. Aysu kuru dallardan küçük bir ateş yaktı. Gökyüzü yıldızlarla doluydu, çöl sessizdi.

"Su nasıl yetecek?" diye sordu Mert.

"Tasarruf edeceğiz," dedi Aysu. "Sabah ilk iş su arayacağız."`
      },
      {
        id: 3,
        title: "Chapter 3: Finding a Way",
        content: `Ertesi sabah kaya yüzeyinde yosun gördüler. Yosun nem demekti. Aysu bıçağıyla kayaya dokundu, küçük bir sızıntı buldu. Su soğuk ve temizdi.

Su şişelerini doldurdular. Sonra kanyon boyunca ilerleyip eski bir keçi yoluna ulaştılar. Yol onları ana patikaya çıkardı.

Bitkin ama canlıydılar. Çöl yıldızları altında verdikleri sözü hatırladılar: Bir daha rotayı kontrol etmeden yola çıkmayacaklardı.`
      }
    ]
  },
  {
    id: 14,
    title: "Bridge of Voices",
    author: "YDS PRO",
    cover: "🌉",
    coverStyle: COVER_STYLES.royal,
    level: "B2",
    description: "Farklı ülkelerden gençlerin bir dil değişim kampında kurdukları dostluk.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Arrival",
        content: `İspanya'dan Lucia, Türkiye'den Kerem, Japonya'dan Yui, Brezilya'dan Rafael. Hepsi Almanya'daki dil kampına aynı gün geldiler.

"Burada herkes farklı, ama ortak bir dil bulacağız," dedi kamp lideri Anna. "Hata yapmaktan korkmayın."`
      },
      {
        id: 2,
        title: "Chapter 2: Misunderstandings",
        content: `İlk hafta küçük karışıklıklarla geçti. Kerem "borrow" yerine "steal" deyince Lucia şaşırdı. Yui "dessert" ile "desert"ı karıştırdı.

Ama her hata kahkahaya dönüştü. Her gün yeni kelimeler, yeni deyimler öğrenildi.`
      },
      {
        id: 3,
        title: "Chapter 3: The Bridge",
        content: `Kampın son günü herkes ana dillerinde bir şarkı söyledi. Lucia flamenco ritmiyle, Kerem bağlama eşliğinde, Yui geleneksel bir ezgiyle, Rafael samba temposuyla.

Farklı diller, tek bir köprü kurdu: müzik. Kerem dedi ki, "Diller arasında köprü kurduk. Şimdi ayrılıyoruz ama seslerimiz kalacak."`
      }
    ]
  },
  {
    id: 15,
    title: "Polar Lights",
    author: "YDS PRO",
    cover: "🧭",
    coverStyle: COVER_STYLES.arctic,
    level: "B1",
    description: "Kuzey ışıklarını görmek için yola çıkan bir ailenin yolculuğu.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Northbound",
        content: `Ayşe, eşi Mark ve oğulları Leo Norveç'e uçuyordu. Leo'nun tek dileği kuzey ışıklarını görmekti.

"Anne, gerçekten görecek miyiz?" diye sordu.

"Hava açık olursa evet," dedi Ayşe. "Sabırlı olmalıyız."`
      },
      {
        id: 2,
        title: "Chapter 2: Waiting",
        content: `İlk iki gece bulutluydu. Leo üzülmeye başladı. Otel sahibi, "Bazen bir dakika içinde belirir, bazen saatler sürer," dedi.

Üçüncü gece gökyüzü açıldı. Hava eksi on, nefesleri buhar. Hepsi kalın montlarına sarındı, karların üzerinde bekledi.`
      },
      {
        id: 3,
        title: "Chapter 3: The Lights",
        content: `Birden gökyüzünde yeşil bir perde kıvrıldı. Sonra mor, sonra mavi. Işıklar dans ediyordu.

Leo'nun gözleri doldu. "Bu gerçek mi?"

Ayşe gülümsedi. "Gerçek. Ve beklemeye değdi."`
      }
    ]
  },
  {
    id: 16,
    title: "City of Threads",
    author: "YDS PRO",
    cover: "🧵",
    coverStyle: COVER_STYLES.spring,
    level: "C1",
    description: "Bir moda tasarımcısının sürdürülebilirlik mücadelesi. Moda endüstrisinin iç yüzü.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Runway Pressure",
        content: `Lara Milano Moda Haftası'na üç gün kalmıştı. Koleksiyonu sürdürülebilir kumaşlarla yapmıştı ama sponsorlar sentetik istedi.

"Organik pahalı," dediler. "Hızlı üretim lazım."

Lara başını salladı. "Hızlı moda gezegeni öldürüyor. Ben başka bir yol göstermek istiyorum."`
      },
      {
        id: 2,
        title: "Chapter 2: Pushback",
        content: `Basın toplantısında bir gazeteci sordu: "Neden %100 geri dönüştürülmüş kumaş? Kalite düşmüyor mu?"

Lara podyumda elbisesini gösterdi. "Kalite düşmüyor. Algı düşüyor. Biz algıyı değiştirirsek endüstri değişir."

Sosyal medyada #CityOfThreads etiketi trend oldu. İnsanlar sorular sormaya başladı: "Giysilerimizi kim üretiyor? Kumaşlar nereden geliyor?"`
      },
      {
        id: 3,
        title: "Chapter 3: New Pattern",
        content: `Defile günü geldi. Modeller yürürken ekranda su tüketimi, karbon emisyonu verileri gösterildi. Lara mesajını net verdi: Moda güzel olabilir, ama etik ve gezegen dostu da olmalı.

Ön sıra izleyicileri başta şaşırdı, sonra alkışladı. Bir yatırımcı yanına geldi: "Sürdürülebilir bir üretim hattı kurmak istiyorum. Beraber çalışalım."

Lara'nın yüzü aydınlandı. Yeni bir desen çizilmeye başlamıştı.`
      }
    ]
  },
  {
    id: 17,
    title: "Echoes in Stone",
    author: "YDS PRO",
    cover: "🏛️",
    coverStyle: COVER_STYLES.storm,
    level: "B2",
    description: "Bir arkeoloji kazısında ortaya çıkan beklenmedik bir sır. Tarih ve etik üzerine soru işaretleri.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Chamber",
        content: `Prof. Deniz ve ekibi Göbeklitepe yakınlarında yeni bir oda açtı. Oda duvarlarında bilinmeyen semboller, ortada taş bir masa vardı.

\"Bu simgeler kayıtlı değil,\" dedi Deniz. \"Yeni bir dil olabilir.\"`
      },
      {
        id: 2,
        title: "Chapter 2: The Dilemma",
        content: `Kazı izni sınırlıydı. Medya baskısı artıyordu. Sponsorlar hızlı sonuç istiyordu.

Ekipten biri gizlice fotoğraf sızdırdı. Sosyal medya çalkalandı: "Dünya mirası mı, özel keşif mi?"

Deniz ekibine döndü: "Etik kuralları çiğnersek bilim kaybeder. Sabırla, kurallara uygun ilerleyeceğiz."`
      },
      {
        id: 3,
        title: "Chapter 3: The Message",
        content: `Dil çözülmeye başlayınca anlam çıktı: "Taşıyan değil, koruyan yaşar." Bu, bilginin paylaşılması gerektiğini vurguluyordu.

Deniz basın toplantısında bunu söyledi: "Geçmiş bize diyor ki; bilgi, saklandıkça ölür, paylaşıldıkça yaşar."`
      }
    ]
  },
  {
    id: 18,
    title: "Paper Planets",
    author: "YDS PRO",
    cover: "📄",
    coverStyle: COVER_STYLES.minimal,
    level: "B1",
    description: "Bir origami meraklısı çocuğun hayal gücüyle uzaya yolculuğu.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: Fold",
        content: `Ege kağıttan gezegenler yapıyordu. Mars'ı kırmızı, Jüpiter'i çizgili, Satürn'ü halkalı. Her katlamada yeni bir detay ekledi.

"Gerçekten oralara gidebilir miyim?" diye sordu babasına.

"Hayal gücünle gidersin," dedi babası. "Bilimle belki bir gün gerçekten."`
      },
      {
        id: 2,
        title: "Chapter 2: Imagine",
        content: `O gece Ege kağıt gezegenleri yatağının etrafına dizdi. Rüyasında kendini karton bir roketle uzayda buldu. Kağıt gezegenler dev ve canlıydı.

Mars ona, "Merak et, soru sor," dedi. Jüpiter, "Büyük düşün," dedi. Satürn, "Güzelliği gör," dedi.`
      },
      {
        id: 3,
        title: "Chapter 3: Create",
        content: `Sabah Ege karar verdi: Okulun bilim fuarına bir güneş sistemi maketi yapacaktı. Kağıt, karton, LED ışıklar kullandı.

Proje günü jüriler gülümsedi. "Harika hayal gücü," dediler. Ege fısıldadı: "Bir gün gerçek bir roketle gideceğim."`
      }
    ]
  },
  {
    id: 19,
    title: "River Letters",
    author: "YDS PRO",
    cover: "🪶",
    coverStyle: COVER_STYLES.earth,
    level: "B2",
    description: "Bir nehir kıyısında mektuplarla kurulan beklenmedik bir dostluk.",
    chapters: [
      {
        id: 1,
        title: "Chapter 1: The Bottle",
        content: `Aslı nehir kenarında yürürken bir cam şişe buldu. İçinde bir mektup vardı: "Merhaba, ben Luka. Bu mektup kime ulaşırsa cevap yazsın."

Aslı şaşırdı, ama heyecanlandı. "Neden olmasın?" dedi.`
      },
      {
        id: 2,
        title: "Chapter 2: Exchanging Worlds",
        content: `Aslı cevap yazdı: İstanbul'dan, Boğaz'dan, vapur seslerinden bahsetti. Mektubu aynı şişeye koyup nehre bıraktı.

İki hafta sonra yeni bir mektup geldi. Luka, Hırvatistan'daki küçük kasabasını, balıkçıları, zeytin ağaçlarını anlattı.

Mektuplar gidip geldikçe iki dünya birbirine karıştı.`
      },
      {
        id: 3,
        title: "Chapter 3: Meeting",
        content: `Bir yıl sonra Luka ailesiyle İstanbul'a geldi. Aslı onları karşıladı. Nehir kenarında buluştular, şişeyi ve mektupları yan yana koydular.

Aslı, "Mektuplar köprü kurar," dedi. Luka başını salladı. "Bazen en güçlü köprüler kağıttandır."`
      }
    ]
  }
];

