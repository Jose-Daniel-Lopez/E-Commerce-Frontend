declare module 'vue-credit-card' {
  import { DefineComponent } from 'vue'

  interface VueCreditCardProps {
    name?: string
    number?: string
    expiry?: string
    cvc?: string
    backgroundColor?: string
    'background-color'?: string
  }

  const VueCreditCard: DefineComponent<VueCreditCardProps>
  export default VueCreditCard
}
