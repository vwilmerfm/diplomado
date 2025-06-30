function validate(schema, target = 'body') {
    return (req, res, next) => {
        const data = req[target];

        // paso 1 verificar que haya datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'No data found' });
        }

        // paso 2 validar contra el schema con opciones
        const { error, value } = schema.validate(data, {
            abortEarly: false, // No detenerse en el primer error
            stripUnknown: true, // Eliminar campos no definidos en el schema
        });

        // paso 3 si hay errores de validacion, devolver 400 con mensaje
        if (error) {
            return res.status(400).json({
                message: `Error de validación en ${target}`,
                errores: error.details.map(err => err.message),
            });
        }

        // paso 4 Reemplazar el objeto original con datos limpios
        req[target] = value;

        // Continuamos...
        next();
    };
}

export default validate;
