import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection onOrderClick={() => console.log('Order clicked')} />
  );
}
