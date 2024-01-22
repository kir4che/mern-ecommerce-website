const Input = ({ text, type = 'text', name, value, placeholder = '', onChange }) => {
  return (
    <label className='block'>
      {text}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  )
}

export default Input