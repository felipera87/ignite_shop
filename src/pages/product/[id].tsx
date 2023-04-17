import Head from 'next/head'
import Stripe from 'stripe'
import { stripe } from "@/lib/stripe"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from 'next/image'
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);
  const { isFallback } = useRouter()

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      // Here is a good place to connect with a observation tool like datadog or sentry
      setIsCreatingCheckoutSession(false);
      alert('Fail to redirect to checkout.');
    }
  }

  if (isFallback) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
    
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
            Buy now
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
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
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}