import OrderForm from '../OrderForm';

export default function OrderFormExample() {
  return (
    <OrderForm
      total={91000}
      onSubmit={(data) => console.log('Order submitted:', data)}
      onCancel={() => console.log('Order cancelled')}
    />
  );
}
