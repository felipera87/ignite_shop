
import { HomeContainer, Product } from "@/styles/pages/home"
import Image from "next/image"

import shirt1 from '../assets/shirts/1.png'
import shirt2 from '../assets/shirts/2.png'
import shirt3 from '../assets/shirts/3.png'

export default function Home() {
  return (
    <HomeContainer>
      <Product>
        <Image src={shirt1} width={520} height={480} alt="" />

        <footer>
          <strong>Shirt 1</strong>
          <span>$ 49.90</span>
        </footer>
      </Product>

      <Product>
        <Image src={shirt2} width={520} height={480} alt="" />

        <footer>
          <strong>Shirt 2</strong>
          <span>$ 49.90</span>
        </footer>
      </Product>
    </HomeContainer>
  )
}
