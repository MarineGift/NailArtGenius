import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ServicesCarousel } from '@/components/services-carousel';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Services() {
  const { t } = useLanguage();

  const ServiceSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const ServiceItem = ({ name, price }: { name: string; price: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="text-gray-700 dark:text-gray-300">{name}</span>
      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
        {price}
      </Badge>
    </div>
  );

  const DesignTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-50 dark:bg-purple-900/20">
            <th className="text-left p-3 border border-gray-200 dark:border-gray-700"></th>
            <th className="text-center p-3 border border-gray-200 dark:border-gray-700 font-semibold">
              {t('services.design.full_set')}
            </th>
            <th className="text-center p-3 border border-gray-200 dark:border-gray-700 font-semibold">
              {t('services.design.fill_in')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.gel_x')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$75</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$50</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.pink_white')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$65</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$45</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.silk_wrap')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$60</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$30</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.gel_acrylic')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$65</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$45+</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.acrylic')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$50</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$30+</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.removal')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$15</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">-</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">{t('services.design.dip_powder')}</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">$50+</td>
            <td className="text-center p-3 border border-gray-200 dark:border-gray-700">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('services.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8"></div>
        </div>

        {/* Services Carousel */}
        <div className="max-w-6xl mx-auto mb-12">
          <ServicesCarousel />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Spa Specials */}
          <ServiceSection title={t('services.spa.title')}>
            <div className="grid gap-4">
              <ServiceItem name={t('services.spa.manicure')} price="$40" />
              <ServiceItem name={t('services.spa.pedicure')} price="$70" />
            </div>
          </ServiceSection>

          {/* Nail Treatments */}
          <ServiceSection title={t('services.treatments.title')}>
            <div className="grid gap-4">
              <ServiceItem name={t('services.treatments.regular_manicure')} price="$18" />
              <ServiceItem name={t('services.treatments.buff_shine')} price="$23" />
              <ServiceItem name={t('services.treatments.french_manicure')} price="$23" />
              <ServiceItem name={t('services.treatments.regular_pedicure')} price="$40" />
              <ServiceItem name={t('services.treatments.gel_manicure')} price="$35" />
              <ServiceItem name={t('services.treatments.gel_french')} price="$40" />
              <ServiceItem name={t('services.treatments.polish_change_finger')} price="$13" />
              <ServiceItem name={t('services.treatments.polish_change_toe')} price="$18" />
              <ServiceItem name={t('services.treatments.gel_pedicure')} price="$50" />
              <ServiceItem name={t('services.treatments.manicure_paraffin')} price="$28" />
              <ServiceItem name={t('services.treatments.pedicure_paraffin')} price="$48" />
              <ServiceItem name={t('services.treatments.pedicure_callus')} price="$55" />
            </div>
          </ServiceSection>

          {/* Waxing */}
          <ServiceSection title={t('services.waxing.title')}>
            <div className="grid gap-4">
              <ServiceItem name={t('services.waxing.eyebrows')} price="$12" />
              <ServiceItem name={t('services.waxing.lip')} price="$10" />
              <ServiceItem name={t('services.waxing.chin')} price="$12" />
              <ServiceItem name={t('services.waxing.sideburns')} price="$10" />
              <ServiceItem name={t('services.waxing.complete_face')} price="$39" />
              <ServiceItem name={t('services.waxing.underarms')} price="$20" />
              <ServiceItem name={t('services.waxing.full_arms')} price="$39" />
              <ServiceItem name={t('services.waxing.half_arms')} price="$25" />
              <ServiceItem name={t('services.waxing.half_legs')} price="$30" />
              <ServiceItem name={t('services.waxing.bikini')} price="$30+" />
              <ServiceItem name={t('services.waxing.full_legs')} price="$60" />
              <ServiceItem name={t('services.waxing.stomach')} price="$20" />
              <ServiceItem name={t('services.waxing.back')} price="$40" />
              <ServiceItem name={t('services.waxing.chest')} price="$40" />
              <ServiceItem name={t('services.waxing.brazilian')} price="$50+" />
            </div>
          </ServiceSection>

          {/* Nail Design */}
          <ServiceSection title={t('services.design.title')}>
            <DesignTable />
          </ServiceSection>

          {/* Chair Massage */}
          <ServiceSection title={t('services.massage.title')}>
            <div className="grid gap-4">
              <ServiceItem name={t('services.massage.10_min')} price="$15" />
              <ServiceItem name={t('services.massage.15_min')} price="$20" />
            </div>
          </ServiceSection>

          {/* Kids Services */}
          <ServiceSection title={t('services.kids.title')}>
            <div className="grid gap-4">
              <ServiceItem name={t('services.kids.mani_pedi')} price="$35" />
              <ServiceItem name={t('services.kids.finger_polish')} price="$10" />
              <ServiceItem name={t('services.kids.toe_polish')} price="$15" />
            </div>
          </ServiceSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}