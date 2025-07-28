# Guía para probar la conexión Frontend - Backend de AI Insights y Payroll

## Pasos para ejecutar el proyecto completo:

### 1. Iniciar MongoDB
Asegúrate de que MongoDB esté ejecutándose en tu sistema:
```bash
# Si tienes MongoDB instalado localmente
mongod

# O si usas MongoDB Compass, simplemente ábrelo
```

### 2. Ejecutar el Backend
Abre una terminal en la carpeta Backend:
```bash
cd Backend
npm install  # Si es la primera vez
npm start    # o node server.js
```
El backend debería estar corriendo en http://localhost:5000

### 3. Ejecutar el Frontend
Abre otra terminal en la carpeta project:
```bash
cd project
npm install  # Si es la primera vez
npm run dev  # Para ejecutar con Vite
```
El frontend debería estar corriendo en http://localhost:5173

### 4. Probar la conexión
1. Ve a http://localhost:5173 en tu navegador
2. Para AI Insights:
   - Navega a la página "IA Insights"
   - Haz clic en "Crear Datos de Prueba" para generar insights de ejemplo
   - Haz clic en "Actualizar Datos" para cargar los insights desde el backend
3. Para Payroll:
   - Navega a la página "Gestión de Nómina"
   - Haz clic en "Crear Datos de Prueba" para generar nóminas de ejemplo
   - Haz clic en "Actualizar" para cargar las nóminas desde el backend

## Qué se ha implementado:

### Backend:
- ✅ Modelo de AIInsight en MongoDB
- ✅ Modelo de Payroll en MongoDB
- ✅ Controladores con CRUD completo para insights y payrolls
- ✅ Rutas API en `/api/ai-insights` y `/api/payrolls`
- ✅ Métodos para crear datos de prueba en ambos módulos
- ✅ CORS configurado para permitir conexión desde frontend
- ✅ Rutas temporalmente públicas para desarrollo (sin autenticación)

### Frontend:
- ✅ Servicio API para conectar con backend (insights y payrolls)
- ✅ Context actualizado para usar datos reales del backend
- ✅ Página AIInsights actualizada con estados de carga y error
- ✅ Página Payroll actualizada con estados de carga y error
- ✅ Botones para crear datos de prueba en ambas páginas
- ✅ Transformación de datos del backend al formato del frontend
- ✅ Manejo de estados vacíos y errores
- ✅ Interfaz PayrollRecord agregada a tipos

## Endpoints disponibles:

### AI Insights:
- `GET /api/ai-insights` - Obtener todos los insights
- `POST /api/ai-insights` - Crear un nuevo insight
- `PUT /api/ai-insights/:id` - Actualizar un insight
- `DELETE /api/ai-insights/:id` - Eliminar un insight
- `POST /api/ai-insights/sample` - Crear datos de prueba

### Payrolls:
- `GET /api/payrolls` - Obtener todas las nóminas
- `GET /api/payrolls/:id` - Obtener una nómina específica
- `POST /api/payrolls` - Crear una nueva nómina
- `PUT /api/payrolls/:id` - Actualizar una nómina
- `DELETE /api/payrolls/:id` - Eliminar una nómina
- `POST /api/payrolls/sample` - Crear datos de prueba

## Estructura de datos:
- Los insights del backend se transforman automáticamente para coincidir con el formato esperado por el frontend
- Las nóminas del backend incluyen información de empleados, totales y estados
- Mapeo automático de `_id` a `id` y conversión de fechas
- Estados de nómina: draft, processing, approved, paid

## Funcionalidades implementadas:
- ✅ Carga de datos desde backend al iniciar la aplicación
- ✅ Estados de carga con spinners
- ✅ Manejo de errores con mensajes informativos
- ✅ Botones de actualización manual
- ✅ Creación de datos de prueba desde la interfaz
- ✅ Estados vacíos informativos
- ✅ Transformación automática de datos

## Troubleshooting:
- Si ves errores de CORS, verifica que el backend esté corriendo en puerto 5000
- Si no se conecta a MongoDB, asegúrate de que esté ejecutándose en puerto 27017
- Si hay errores de TypeScript, ejecuta `npm run type-check` en el frontend
- Si los datos no aparecen, verifica la consola del navegador para errores de red
