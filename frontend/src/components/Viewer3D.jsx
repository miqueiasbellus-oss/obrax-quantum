import React, { useState, useEffect, useRef } from 'react';
import { 
  CubeIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  EyeIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Viewer3D = ({ activity, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('perspective');
  const [showInfo, setShowInfo] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Simular carregamento do modelo 3D
    const timer = setTimeout(() => {
      setIsLoading(false);
      startAnimation();
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    const animate = () => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 0.3,
        z: prev.z + 0.1
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
    setViewMode('perspective');
  };

  const getActivityType = () => {
    const grupo = activity?.grupo?.toLowerCase() || '';
    if (grupo.includes('estrutura') || grupo.includes('concreto')) return 'structure';
    if (grupo.includes('alvenaria')) return 'masonry';
    if (grupo.includes('revestimento')) return 'coating';
    if (grupo.includes('instalacoes')) return 'installations';
    return 'general';
  };

  const get3DModelInfo = () => {
    const type = getActivityType();
    const models = {
      structure: {
        name: 'Estrutura de Concreto',
        elements: ['Pilares', 'Vigas', 'Lajes', 'Fundações'],
        materials: ['Concreto C25', 'Aço CA-50', 'Fôrmas'],
        color: '#6B7280'
      },
      masonry: {
        name: 'Alvenaria de Vedação',
        elements: ['Blocos Cerâmicos', 'Argamassa', 'Vergas', 'Contravergas'],
        materials: ['Bloco 14x19x29', 'Argamassa 1:4', 'Aço CA-60'],
        color: '#DC2626'
      },
      coating: {
        name: 'Revestimento Argamassado',
        elements: ['Chapisco', 'Emboço', 'Reboco', 'Pintura'],
        materials: ['Argamassa 1:3', 'Tinta Acrílica', 'Primer'],
        color: '#059669'
      },
      installations: {
        name: 'Instalações Prediais',
        elements: ['Tubulações', 'Conexões', 'Caixas', 'Dispositivos'],
        materials: ['PVC', 'Cobre', 'Aço Galvanizado'],
        color: '#2563EB'
      },
      general: {
        name: 'Elemento Construtivo',
        elements: ['Componentes Diversos'],
        materials: ['Materiais Variados'],
        color: '#7C3AED'
      }
    };
    return models[type];
  };

  const modelInfo = get3DModelInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Visualização 3D - IFS</h2>
              <p className="text-sm text-gray-600">{activity?.codigo} - {activity?.atividade}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Informações"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Painel de Informações */}
          {showInfo && (
            <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Modelo 3D</h3>
                  <p className="text-sm text-gray-600">{modelInfo.name}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Elementos</h4>
                  <ul className="space-y-1">
                    {modelInfo.elements.map((element, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: modelInfo.color }}
                        ></div>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Materiais</h4>
                  <ul className="space-y-1">
                    {modelInfo.materials.map((material, index) => (
                      <li key={index} className="text-sm text-gray-600">• {material}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dados da Atividade</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Local:</span>
                      <span className="ml-2 font-medium">{activity?.pavimento} - {activity?.local}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Progresso:</span>
                      <span className="ml-2 font-medium">{activity?.perc_prog_atual}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium">{activity?.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-1">IFS - Integrated Facility Systems</h4>
                  <p className="text-xs text-blue-800">
                    Visualização integrada baseada no modelo BIM da edificação, 
                    permitindo análise detalhada dos elementos construtivos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Área de Visualização 3D */}
          <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando modelo 3D...</p>
                  <p className="text-sm text-gray-500 mt-1">Processando dados IFS</p>
                </div>
              </div>
            ) : (
              <>
                {/* Simulação do Modelo 3D */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative"
                    style={{
                      transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    {/* Simulação de estrutura 3D com CSS */}
                    <div className="relative w-64 h-64">
                      {/* Base */}
                      <div 
                        className="absolute bottom-0 w-full h-8 rounded-lg shadow-lg"
                        style={{ backgroundColor: modelInfo.color, opacity: 0.8 }}
                      ></div>
                      
                      {/* Elementos verticais */}
                      <div 
                        className="absolute left-4 bottom-8 w-8 h-32 rounded-lg shadow-lg"
                        style={{ backgroundColor: modelInfo.color, opacity: 0.9 }}
                      ></div>
                      <div 
                        className="absolute right-4 bottom-8 w-8 h-32 rounded-lg shadow-lg"
                        style={{ backgroundColor: modelInfo.color, opacity: 0.9 }}
                      ></div>
                      
                      {/* Elemento horizontal superior */}
                      <div 
                        className="absolute top-24 left-4 right-4 h-8 rounded-lg shadow-lg"
                        style={{ backgroundColor: modelInfo.color, opacity: 0.7 }}
                      ></div>
                      
                      {/* Detalhes adicionais baseados no tipo */}
                      {getActivityType() === 'masonry' && (
                        <>
                          <div className="absolute left-8 bottom-16 w-16 h-16 bg-red-400 opacity-60 rounded"></div>
                          <div className="absolute right-8 bottom-16 w-16 h-16 bg-red-400 opacity-60 rounded"></div>
                        </>
                      )}
                      
                      {getActivityType() === 'installations' && (
                        <>
                          <div className="absolute left-12 bottom-12 w-2 h-20 bg-blue-500 rounded-full"></div>
                          <div className="absolute right-12 bottom-12 w-2 h-20 bg-blue-500 rounded-full"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controles de Visualização */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Zoom In"
                    >
                      <ArrowsPointingOutIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Zoom Out"
                    >
                      <ArrowsPointingInIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetView}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Reset View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Controles de Modo de Visualização */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('perspective')}
                      className={`px-3 py-1 text-sm rounded ${
                        viewMode === 'perspective' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Perspectiva
                    </button>
                    <button
                      onClick={() => setViewMode('orthographic')}
                      className={`px-3 py-1 text-sm rounded ${
                        viewMode === 'orthographic' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Ortográfica
                    </button>
                  </div>
                </div>

                {/* Informações de Progresso */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
                  <div className="text-sm">
                    <div className="text-gray-600 mb-1">Progresso da Atividade</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity?.perc_prog_atual || 0}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{activity?.perc_prog_atual || 0}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer com Controles */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={animationRef.current ? stopAnimation : startAnimation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {animationRef.current ? 'Parar Rotação' : 'Iniciar Rotação'}
              </button>
              
              <div className="text-sm text-gray-600">
                Zoom: {(zoom * 100).toFixed(0)}% | 
                Rotação: X:{rotation.x.toFixed(0)}° Y:{rotation.y.toFixed(0)}° Z:{rotation.z.toFixed(0)}°
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Powered by IFS 3D Engine</span>
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <CubeIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer3D;
