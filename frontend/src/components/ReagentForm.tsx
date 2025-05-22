import React from 'react';
import { Reagents } from '../interface/IReagents';

interface Props {
  form: Omit<Reagents, 'reagentId'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Reagents, 'reagentId'>>>;
  onCreate: () => void;
  loading: boolean;
}

const ReagentForm: React.FC<Props> = ({ form, setForm, onCreate, loading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'date'
        ? new Date(value)
        : name === 'reagentQuantity'
          ? Number(value)
          : value,
    }));
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };

  type FormField = keyof Omit<typeof form, 'reagentAddDate' | 'reagentExpirationDate' | 'reagentUnit'>;

  const fields: { label: string; name: FormField; type?: string }[] = [
    { label: 'CAS', name: 'reagentCas' },
    { label: 'Nombre', name: 'reagentName' },
    { label: 'Cantidad', name: 'reagentQuantity', type: 'number' },
    { label: 'Proveedor', name: 'reagentSupplier' },
    { label: 'Tipo', name: 'reagentType' },
    { label: 'FDS', name: 'reagentFDS' },
  ];

  return (
    <div className="reagent-form-container">
      {fields.map(({ label, name, type = 'text' }) => (
        <div key={name} className="reagent-form-group">
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            className="reagent-input"
          />
        </div>
      ))}

      <div className="reagent-form-group">
        <label htmlFor="reagentUnit">Unidad</label>
        <select
          id="reagentUnit"
          name="reagentUnit"
          value={form.reagentUnit}
          onChange={handleChange}
          className="reagent-input"
        >
          <option value="">Selecciona unidad</option>
          <option value="g">g</option>
          <option value="mg">mg</option>
          <option value="kg">kg</option>
          <option value="L">L</option>
          <option value="mL">mL</option>
          <option value="µL">µL</option>
          <option value="mol">mol</option>
          <option value="mmol">mmol</option>
          <option value="unidades">unidades</option>
        </select>
      </div>

      <div className="reagent-form-group">
        <label htmlFor="reagentAddDate">Fecha de Adición</label>
        <input
          type="date"
          id="reagentAddDate"
          name="reagentAddDate"
          value={formatDate(form.reagentAddDate)}
          onChange={handleChange}
          className="reagent-input"
        />
      </div>

      <div className="reagent-form-group">
        <label htmlFor="reagentExpirationDate">Fecha de Expiración</label>
        <input
          type="date"
          id="reagentExpirationDate"
          name="reagentExpirationDate"
          value={formatDate(form.reagentExpirationDate)}
          onChange={handleChange}
          className="reagent-input"
        />
      </div>

      <button className="reagent-btn-create" onClick={onCreate} disabled={loading}>
        Crear
      </button>
    </div>
  );
};

export default ReagentForm;
