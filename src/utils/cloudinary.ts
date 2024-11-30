import { Cloudinary } from '@cloudinary/url-gen';

// Cloudinary instance'ını oluştur
export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dcjsorpmd'
  }
});

// Resim optimizasyonu için yardımcı fonksiyon
export const getOptimizedImageUrl = (publicId: string) => {
  return `https://res.cloudinary.com/dcjsorpmd/image/upload/c_fill,g_auto,h_600,w_800,q_auto/${publicId}`;
};

// Varsayılan resimler - Pexels'den güvenilir resimler
export const DEFAULT_IMAGES = [
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];
