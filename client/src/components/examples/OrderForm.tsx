interface OrderFormProps {
  total: number;
  onSubmit: (data: { name: string; email: string; message: string }) => void; // aniq tur bilan
  onCancel: () => void;
}
