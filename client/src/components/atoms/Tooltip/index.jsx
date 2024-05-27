const Tooltip = ({ isActivated, text }) => (
	<p
		className={`${
			isActivated ? 'block' : 'hidden'
		} absolute z-50 px-4 py-2 text-sm bg-primary/65 text-secondary top-14 right-4 rounded-xl`}
	>
		{text}
	</p>
)

export default Tooltip
