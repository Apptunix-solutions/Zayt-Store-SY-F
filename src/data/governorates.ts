export interface SyrianGovernorate {
  id: string
  nameAr: string
  nameEn: string
  region?: string
}

export const syrianGovernorates: SyrianGovernorate[] = [
  { id: 'damascus', nameAr: 'دمشق', nameEn: 'Damascus', region: 'المنطقة الجنوبية' },
  { id: 'rif-dimashq', nameAr: 'ريف دمشق', nameEn: 'Rif Dimashq', region: 'المنطقة الجنوبية' },
  { id: 'aleppo', nameAr: 'حلب', nameEn: 'Aleppo', region: 'المنطقة الشمالية' },
  { id: 'homs', nameAr: 'حمص', nameEn: 'Homs', region: 'المنطقة الوسطى' },
  { id: 'hama', nameAr: 'حماة', nameEn: 'Hama', region: 'المنطقة الوسطى' },
  { id: 'latakia', nameAr: 'اللاذقية', nameEn: 'Latakia', region: 'المنطقة الساحلية' },
  { id: 'tartus', nameAr: 'طرطوس', nameEn: 'Tartus', region: 'المنطقة الساحلية' },
  { id: 'idlib', nameAr: 'إدلب', nameEn: 'Idlib', region: 'المنطقة الشمالية' },
  { id: 'daraa', nameAr: 'درعا', nameEn: 'Daraa', region: 'المنطقة الجنوبية' },
  { id: 'sweida', nameAr: 'السويداء', nameEn: 'As-Suwayda', region: 'المنطقة الجنوبية' },
  { id: 'quneitra', nameAr: 'القنيطرة', nameEn: 'Quneitra', region: 'المنطقة الجنوبية' },
  { id: 'deir-ez-zor', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor', region: 'المنطقة الشرقية' },
  { id: 'hasakah', nameAr: 'الحسكة', nameEn: 'Al-Hasakah', region: 'المنطقة الشرقية' },
  { id: 'raqqa', nameAr: 'الرقة', nameEn: 'Ar-Raqqah', region: 'المنطقة الشرقية' },
]
