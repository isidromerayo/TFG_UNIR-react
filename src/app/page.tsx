
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import SliderComponent from './components/SliderComponent';

export default function Home() {
  return (
    <div>

      <HeaderComponent></HeaderComponent>

      <SliderComponent></SliderComponent>

      <main id="main">
        <HomeComponent></HomeComponent>
      </main>
      
      <FooterComponent></FooterComponent>

    </div>

  )
}
