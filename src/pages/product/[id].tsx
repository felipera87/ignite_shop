import Stripe from 'stripe'
import { stripe } from "@/lib/stripe"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from 'next/image'
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import { useRouter } from 'next/router'

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
  }
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter()

  if (isFallback) {
    return <p>Loading...</p>
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>
          Buy now
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // list of paths for build time, it'll generate all pages in this array
    paths: [
      { params: { id: 'prod_NglvWCCEu9xtGp' } }
    ],
    // if fallback is false it'll return 404 if id is not the paths exported by getStaticPaths
    // if set to true it'll run getStaticProps instead, but it'll send props initially as undefined
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id ?? '';

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount ?? 0) / 100),
        description: product.description,
      }
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}