# 💧 HidroSaver Frontend - Sistema de Gestión de Pagos de Agua

## 🚀 Descripción del Proyecto

HidroSaver es un sistema completo de gestión de pagos de servicios hídricos desarrollado con React. Permite administrar usuarios, procesar pagos, generar reportes y gestionar sectores de manera eficiente y moderna.

## ✨ Nuevas Funcionalidades Implementadas

### 🔐 **Autenticación Mejorada**

- **Creación automática del primer administrador** si no existe ninguno en el sistema
- **Verificación de tokens JWT** con persistencia de sesión
- **Interfaz de login moderna** con validaciones mejoradas
- **Manejo de roles** (preparado para expansión futura)

### 🏘️ **Gestión de Sectores**

- **CRUD completo de sectores** con interfaz visual
- **Selects dinámicos** que cargan sectores desde la API
- **Validaciones** para asegurar la integridad de datos
- **Interfaz moderna** con cards y animaciones

### 📊 **Dashboard Ejecutivo**

- **KPIs en tiempo real**: Recaudación, usuarios, morosos, eficiencia
- **Estadísticas visuales** con indicadores de salud del sistema
- **Filtros por periodo** para análisis temporal
- **Acciones rápidas** para navegación eficiente

### 📋 **Sistema de Reportes Avanzado**

- **Reportes de pagos** filtrados por periodo y sector
- **Lista de morosos** con información detallada
- **Estadísticas generales** con métricas clave
- **Exportación a CSV** para análisis externos
- **Filtros dinámicos** para consultas específicas

### 👥 **Gestión de Usuarios Mejorada**

- **Vista dual**: Búsqueda individual y lista completa
- **Filtros avanzados** por nombre, DPI y sector
- **Tabla interactiva** con acciones rápidas
- **Formularios mejorados** con selects de sectores
- **Validaciones en tiempo real**

### 💳 **Procesamiento de Pagos Modernizado**

- **Modal de confirmación** con detalles de la transacción
- **Validaciones robustas** de datos de entrada
- **Interfaz intuitiva** con campos auto-completados
- **Comprobantes imprimibles** con diseño profesional
- **Estados de loading** para mejor UX

### 🎨 **Diseño y UX Renovados**

- **Interfaz moderna** con gradientes y animaciones
- **Responsive design** optimizado para móviles
- **Navegación mejorada** con iconos y estados activos
- **Componentes consistentes** con sistema de diseño unificado
- **Feedback visual** en todas las interacciones

## 🛠️ **Tecnologías Utilizadas**

### **Core Framework**

- **React 18.3.1** - Framework principal
- **React Router DOM 6.27.0** - Navegación SPA
- **Axios 1.7.7** - Cliente HTTP

### **Herramientas de Desarrollo**

- **React Scripts 5.0.1** - Build tools
- **Cross-env 7.0.3** - Variables de entorno
- **Web Vitals 2.1.4** - Métricas de rendimiento

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── AgregarUsuario.js        # Registro de usuarios con sectores
│   ├── AgregarPago.js           # Procesamiento de pagos mejorado
│   ├── ConsultaUsuarios.js      # Vista dual de consultas
│   ├── Dashboard.js             # Dashboard ejecutivo con KPIs
│   ├── GestionSectores.js       # CRUD de sectores
│   ├── LoginAdmin.js            # Autenticación mejorada
│   ├── Reportes.js              # Sistema de reportes avanzado
│   └── ResumenTransaccion.js    # Comprobantes de pago
├── App.js                       # Componente principal con rutas
├── App.css                      # Estilos globales modernizados
└── index.js                     # Punto de entrada
```

## 🎯 **Funcionalidades por Módulo**

### **Dashboard**

- 📊 KPIs principales (recaudación, usuarios, morosos)
- 📈 Indicadores de salud del sistema
- 🎯 Métricas de eficiencia de cobro
- ⚡ Acciones rápidas de navegación

### **Gestión de Usuarios**

- ➕ Registro con validación de sectores
- 🔍 Búsqueda individual por código de barras
- 📋 Lista completa con filtros avanzados
- ✏️ Edición con formularios dinámicos
- 🗑️ Eliminación con confirmación

### **Procesamiento de Pagos**

- 💳 Interfaz intuitiva con validaciones
- 📄 Modal de confirmación de transacciones
- 🖨️ Generación de comprobantes
- 📅 Auto-completado de fecha actual

### **Reportes**

- 💰 Reporte de pagos por periodo
- ⚠️ Lista de usuarios morosos
- 📊 Estadísticas generales del sistema
- 💾 Exportación a CSV
- 🔍 Filtros por sector y periodo

### **Gestión de Sectores**

- 🏗️ Creación de nuevos sectores
- 📝 Descripción detallada de sectores
- 🗑️ Eliminación con validaciones
- 🎨 Interfaz visual con cards

## 🚀 **Instalación y Configuración**

### **Instalación**

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo (puerto 5000)
npm start

# Build de producción
npm run build
```

### **Configuración**

- **Puerto Frontend**: 5000
- **API Backend**: http://localhost:3000
- **Proxy configurado** para desarrollo

## 🌐 **API Endpoints Utilizados**

### **Autenticación**

- `GET /auth/check-admin` - Verificar existencia de admins
- `POST /auth/register-admin` - Crear primer admin
- `POST /auth/login` - Iniciar sesión

### **Usuarios**

- `GET /usuarios` - Lista con filtros
- `POST /usuarios` - Crear usuario
- `GET /usuarios/:id` - Consultar usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### **Sectores**

- `GET /sectores` - Listar sectores
- `POST /sectores` - Crear sector
- `DELETE /sectores/:id` - Eliminar sector

### **Pagos**

- `POST /pagos` - Procesar pago

### **Reportes**

- `GET /reportes/pagos` - Reporte de pagos
- `GET /reportes/morosos` - Lista de morosos
- `GET /reportes/general` - Estadísticas generales

## 🎨 **Características de Diseño**

- **Interfaz moderna** con gradientes y animaciones
- **Responsive design** optimizado para todos los dispositivos
- **Navegación intuitiva** con iconos y estados visuales
- **Componentes consistentes** con sistema de diseño unificado
- **Feedback visual** en todas las interacciones del usuario

## 🔐 **Seguridad**

- **JWT Tokens** para autenticación
- **Rutas protegidas** por autenticación
- **Validación client-side** y server-side
- **Headers de autorización** en todas las requests

## 📱 **Responsive Design**

- **Mobile First** - Optimizado para dispositivos móviles
- **Breakpoints** adaptativos para tablet y desktop
- **Navegación colapsible** en dispositivos móviles
- **Componentes flexibles** que se adaptan al tamaño de pantalla

---

**💧 HidroSaver - Gestión Inteligente del Recurso Hídrico**

_Desarrollado con ❤️ usando React y tecnologías modernas_

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
