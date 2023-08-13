import { NextPage } from 'next'
import Link from 'next/link'
import SliderComponent from '../components/SliderComponent'
import HomeComponent from '../components/HomeComponent'

const Home: NextPage = () => {
  return (
    <>
      <SliderComponent/>

      <HomeComponent></HomeComponent>
      </>
  )
}

export default Home