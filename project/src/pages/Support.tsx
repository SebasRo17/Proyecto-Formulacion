import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Phone, 
  Mail,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Primeros Pasos',
    questions: [
      {
        question: '¿Cómo configuro mi primera nómina?',
        answer: 'Para configurar tu primera nómina, ve a la sección de Nómina y haz clic en "Nueva Nómina". El sistema te guiará paso a paso para seleccionar empleados, configurar períodos y calcular automáticamente todos los valores según la legislación ecuatoriana.'
      },
      {
        question: '¿Cómo agrego empleados al sistema?',
        answer: 'En la sección de Empleados, haz clic en "Agregar Empleado" y completa todos los campos requeridos incluyendo cédula, datos personales, cargo y salario. El sistema validará automáticamente la información.'
      }
    ]
  },
  {
    id: 'payroll',
    title: 'Nómina y Pagos',
    questions: [
      {
        question: '¿Cómo calcula el sistema los décimos?',
        answer: 'PaySmart AI calcula automáticamente el décimo tercero (suma de remuneraciones ÷ 12) y décimo cuarto (SBU vigente) según las normativas ecuatorianas. Los cálculos se actualizan en tiempo real con cualquier cambio salarial.'
      },
      {
        question: '¿Qué deducciones aplica automáticamente?',
        answer: 'El sistema calcula automáticamente: IESS personal (9.45%), impuesto a la renta según tabla vigente, préstamos IESS, y cualquier descuento personalizado que configures.'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reportes Legales',
    questions: [
      {
        question: '¿Cómo genero el reporte mensual del IESS?',
        answer: 'Ve a la sección Reportes, selecciona "Reporte Mensual IESS", elige el período correspondiente y haz clic en "Generar". El sistema creará automáticamente el archivo en formato requerido por el IESS.'
      },
      {
        question: '¿El sistema envía automáticamente los reportes?',
        answer: 'Sí, puedes configurar el envío automático de reportes. Ve a Configuración > Reportes Automáticos y activa esta funcionalidad para cumplir con las fechas de entrega sin retrasos.'
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'Funciones de IA',
    questions: [
      {
        question: '¿Cómo funciona la predicción de rotación?',
        answer: 'Nuestro algoritmo de IA analiza patrones como ausentismo, rendimiento, tiempo en la empresa, y satisfacción laboral para predecir la probabilidad de que un empleado renuncie en los próximos 3-6 meses.'
      },
      {
        question: '¿Qué tan precisas son las recomendaciones de IA?',
        answer: 'Las recomendaciones tienen una precisión promedio del 87% basada en datos históricos de empresas similares. La precisión mejora continuamente conforme el sistema aprende de los patrones específicos de tu organización.'
      }
    ]
  }
];

const resources = [
  {
    title: 'Manual de Usuario',
    description: 'Guía completa para usar todas las funciones de PaySmart AI',
    type: 'PDF',
    url: '#'
  },
  {
    title: 'Videos Tutoriales',
    description: 'Aprende paso a paso con nuestros videos explicativos',
    type: 'Video',
    url: '#'
  },
  {
    title: 'Webinar: Nuevas Funciones',
    description: 'Conoce las últimas actualizaciones y mejoras',
    type: 'Webinar',
    url: '#'
  },
  {
    title: 'API Documentation',
    description: 'Documentación técnica para integraciones',
    type: 'Docs',
    url: '#'
  }
];

export function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('getting-started');
  const [expandedQuestion, setExpandedQuestion] = useState<string>('');

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Soporte</h1>
          <p className="text-gray-600 mt-1">
            Encuentra respuestas, guías y contacta con nuestro equipo de soporte
          </p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat en Vivo
        </Button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Chat en Vivo</h3>
            <p className="text-sm text-gray-500">Soporte inmediato</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-500">soporte@paysmart.ai</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Teléfono</h3>
            <p className="text-sm text-gray-500">+593 2 245-6789</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Book className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Documentación</h3>
            <p className="text-sm text-gray-500">Guías y tutoriales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                Preguntas Frecuentes
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar en preguntas frecuentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg">
                    <button
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.id ? '' : category.id
                      )}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <h3 className="font-medium text-gray-900">{category.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" size="sm">
                          {category.questions.length}
                        </Badge>
                        {expandedCategory === category.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {expandedCategory === category.id && (
                      <div className="border-t border-gray-200">
                        {category.questions.map((faq, index) => (
                          <div key={index} className="border-b border-gray-100 last:border-b-0">
                            <button
                              onClick={() => setExpandedQuestion(
                                expandedQuestion === `${category.id}-${index}` ? '' : `${category.id}-${index}`
                              )}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-700 text-sm">{faq.question}</p>
                                {expandedQuestion === `${category.id}-${index}` ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                                )}
                              </div>
                            </button>
                            
                            {expandedQuestion === `${category.id}-${index}` && (
                              <div className="px-4 pb-4">
                                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources and Contact */}
        <div className="space-y-6">
          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="w-5 h-5 mr-2 text-green-600" />
                Recursos Útiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                    <p className="text-xs text-gray-500">{resource.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" size="sm">{resource.type}</Badge>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact form */}
          <Card>
            <CardHeader>
              <CardTitle>Contacta con Soporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Asunto"
                placeholder="Describe tu consulta brevemente"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe tu problema o consulta en detalle..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </div>
              <Button className="w-full">
                Enviar Consulta
              </Button>
            </CardContent>
          </Card>

          {/* System status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plataforma</span>
                  <Badge variant="success" size="sm">Operativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IA Insights</span>
                  <Badge variant="success" size="sm">Operativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reportes</span>
                  <Badge variant="success" size="sm">Operativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Integraciones</span>
                  <Badge variant="success" size="sm">Operativo</Badge>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Ver página de estado completa →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}