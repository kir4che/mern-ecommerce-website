/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts,tsx}'],
	theme: {
		extend: {
			screens: {
				xs: '490px',
				sm: '652px',
			},
			minHeight: {
				screenwithh: 'calc(100vh - 4rem)',
				screenwithhf: 'calc(100vh - 17.265rem)',
			},
			minWidth: {
				76: '19rem',
			},
			width: {
				22: '5.5rem',
				88: '22rem',
				100: '25rem',
			},
			height: {
				18: '4.5rem',
				22: '5.5rem',
			},
			padding: {
				0.25: '0.0625rem',
				0.75: '0.1875rem',
			},
			backgroundImage: {
				'about-cover': "url('/src/assets/images/about/about-cover.jpg')",
				'menu-cover': "url('/src/assets/images/about/shop1.jpg')",
			},
			fontSize: {
				'6xl': 'calc(2.625rem + 1vw)',
				'5xl': 'calc(2.875rem + 0.25vw)',
				'4.5xl': 'calc(2rem + 0.5vw)',
				'4xl': 'calc(1.75rem + 0.6vw)',
				'3xl': 'calc(1.25rem + 1vw)',
				'2.5xl': 'calc(1rem + 1vw)',
				'2xl': 'calc(1.5rem + 0.25vw)',
				'1.5xl': 'calc(1.375rem + 0.25vw)',
				xl: 'calc(1.25rem + 0.25vw)',
				lg: 'calc(1.05rem + 0.25vw)',
				base: 'calc(0.875rem + 0.25vw)',
				sm: 'calc(0.75rem + 0.25vw)',
				xs: 'calc(0.625rem + 0.25vw)',
				xxs: 'calc(0.5rem + 0.25vw)',
			},
			colors: {
				primary: '#061222',
				secondary: '#FCFBFA',
			},
		},
	},
	plugins: [],
}
