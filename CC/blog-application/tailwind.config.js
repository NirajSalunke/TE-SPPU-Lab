module.exports = {
    // ... other config
    theme: {
        extend: {
            animation: {
                float: 'float 6s ease-in-out infinite',
                fadeIn: 'fadeIn 1s ease-in forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
} 