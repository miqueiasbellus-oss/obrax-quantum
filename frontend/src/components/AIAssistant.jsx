import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const AIAssistant = ({ activity, onClose, onSave }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('referencias');
  const [generatedContent, setGeneratedContent] = useState({
    referencias: [],
    procedimentos: [],
    dicas: [],
    alertas: []
  });

  useEffect(() => {
    // Gerar conteúdo automaticamente ao abrir
    generateAllContent();
  }, [activity]);

  const generateAllContent = async () => {
    setIsGenerating(true);
    
    // Simular geração de conteúdo por IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = generateContentBasedOnActivity(activity);
    setGeneratedContent(content);
    setIsGenerating(false);
  };

  const generateContentBasedOnActivity = (activity) => {
    const grupo = activity?.grupo?.toLowerCase() || '';
    const atividade = activity?.atividade?.toLowerCase() || '';
    
    // Base de conhecimento simulada
    const knowledgeBase = {
      estrutura: {
        referencias: [
          'NBR 6118:2014 - Projeto de estruturas de concreto',
          'NBR 14931:2004 - Execução de estruturas de concreto',
          'NBR 7480:2007 - Aço destinado a armaduras para estruturas de concreto armado',
          'Manual de Boas Práticas - Estruturas de Concreto (IBRACON)'
        ],
        procedimentos: [
          'Verificar resistência do concreto através de ensaios',
          'Conferir posicionamento e cobrimento das armaduras',
          'Executar cura adequada do concreto por no mínimo 7 dias',
          'Realizar controle tecnológico conforme projeto estrutural'
        ],
        dicas: [
          'Use vibrador de imersão para adensar o concreto adequadamente',
          'Mantenha as fôrmas úmidas antes da concretagem',
          'Evite concretagem em dias muito quentes ou chuvosos',
          'Faça a cura química em lajes expostas ao sol'
        ],
        alertas: [
          'Atenção ao prazo de desforma conforme resistência do concreto',
          'Cuidado com segregação do concreto durante o lançamento',
          'Verificar se não há armaduras expostas após desforma'
        ]
      },
      alvenaria: {
        referencias: [
          'NBR 15961:2011 - Alvenaria estrutural - Blocos de concreto',
          'NBR 8545:1984 - Execução de alvenaria sem função estrutural',
          'Manual Técnico de Alvenaria (ABCP)',
          'Código de Práticas para Alvenaria de Vedação'
        ],
        procedimentos: [
          'Executar primeira fiada sobre impermeabilização',
          'Manter prumo e nível em todas as fiadas',
          'Fazer amarração adequada nos encontros de paredes',
          'Executar vergas e contravergas conforme projeto'
        ],
        dicas: [
          'Molhe os blocos antes do assentamento',
          'Use linha de nylon para manter o alinhamento',
          'Faça juntas de 10mm para argamassa de assentamento',
          'Confira esquadro com régua 3-4-5'
        ],
        alertas: [
          'Não execute alvenaria sobre laje recém-concretada',
          'Atenção às instalações embutidas na alvenaria',
          'Cuidado com cargas concentradas sobre a alvenaria'
        ]
      },
      revestimento: {
        referencias: [
          'NBR 13749:2013 - Revestimento de paredes e tetos de argamassas inorgânicas',
          'NBR 7200:1998 - Execução de revestimento de paredes e tetos de argamassas inorgânicas',
          'Manual de Revestimentos de Argamassa (ABCP)',
          'Tecnologia de Argamassas (Falcão Bauer)'
        ],
        procedimentos: [
          'Preparar base com chapisco aderente',
          'Executar taliscas e mestras niveladas',
          'Aplicar argamassa em camadas uniformes',
          'Fazer acabamento conforme especificação do projeto'
        ],
        dicas: [
          'Umedeça a base antes da aplicação',
          'Use desempenadeira de madeira para acabamento rústico',
          'Faça cura úmida por pelo menos 7 dias',
          'Evite aplicação sob sol forte ou vento'
        ],
        alertas: [
          'Atenção à espessura máxima por camada (2cm)',
          'Cuidado com fissuração por retração',
          'Não aplique sobre base suja ou desenformante'
        ]
      },
      instalacoes: {
        referencias: [
          'NBR 5410:2004 - Instalações elétricas de baixa tensão',
          'NBR 5626:1998 - Instalação predial de água fria',
          'NBR 8160:1999 - Sistemas prediais de esgoto sanitário',
          'Manual de Instalações Prediais (ABNT)'
        ],
        procedimentos: [
          'Seguir projeto executivo das instalações',
          'Fazer teste de estanqueidade em tubulações',
          'Executar aterramento conforme norma',
          'Identificar circuitos e tubulações adequadamente'
        ],
        dicas: [
          'Use lubrificante específico para tubos PVC',
          'Deixe folga para dilatação térmica',
          'Proteja fiação com eletrodutos adequados',
          'Faça teste de continuidade em circuitos elétricos'
        ],
        alertas: [
          'Nunca misture água e eletricidade durante execução',
          'Atenção às interferências entre diferentes sistemas',
          'Cuidado com perfuração de tubulações existentes'
        ]
      }
    };

    // Determinar categoria baseada no grupo da atividade
    let categoria = 'estrutura';
    if (grupo.includes('alvenaria')) categoria = 'alvenaria';
    else if (grupo.includes('revestimento') || grupo.includes('pintura')) categoria = 'revestimento';
    else if (grupo.includes('instalacoes') || grupo.includes('eletrica') || grupo.includes('hidro')) categoria = 'instalacoes';

    const baseContent = knowledgeBase[categoria];

    // Personalizar conteúdo baseado na atividade específica
    const personalizedContent = {
      referencias: [
        ...baseContent.referencias,
        `Especificação técnica específica - ${activity?.codigo}`,
        `Procedimento executivo - ${activity?.atividade}`
      ],
      procedimentos: baseContent.procedimentos.map(proc => 
        `${proc} (aplicável a: ${activity?.atividade})`
      ),
      dicas: [
        ...baseContent.dicas,
        `Para ${activity?.local}: verifique condições específicas do ambiente`,
        `Progresso atual ${activity?.perc_prog_atual}%: foque nos próximos passos`
      ],
      alertas: [
        ...baseContent.alertas,
        activity?.dias_atraso > 0 ? `URGENTE: Atividade em atraso há ${activity.dias_atraso} dias` : null
      ].filter(Boolean)
    };

    return personalizedContent;
  };

  const regenerateContent = async (type) => {
    setIsGenerating(true);
    
    // Simular regeneração
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newContent = generateContentBasedOnActivity(activity);
    setGeneratedContent(prev => ({
      ...prev,
      [type]: newContent[type]
    }));
    
    setIsGenerating(false);
  };

  const saveContent = () => {
    onSave(generatedContent);
  };

  const tabs = [
    { id: 'referencias', label: 'Referências', icon: BookOpenIcon, color: 'blue' },
    { id: 'procedimentos', label: 'Procedimentos', icon: ClipboardDocumentListIcon, color: 'green' },
    { id: 'dicas', label: 'Dicas', icon: LightBulbIcon, color: 'yellow' },
    { id: 'alertas', label: 'Alertas', icon: ExclamationTriangleIcon, color: 'red' }
  ];

  const getTabColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-50',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      red: isActive ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'
    };
    return colors[color];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assistente IA - OBRAX</h2>
              <p className="text-sm text-gray-600">{activity?.codigo} - {activity?.atividade}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${getTabColorClasses(tab.color, isActive)}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isGenerating ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">IA gerando conteúdo...</p>
                <p className="text-sm text-gray-500 mt-1">Analisando dados da atividade</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <button
                  onClick={() => regenerateContent(activeTab)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Regenerar
                </button>
              </div>

              <div className="space-y-3">
                {generatedContent[activeTab]?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{item}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {generatedContent[activeTab]?.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum conteúdo gerado ainda</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <span>Conteúdo gerado por IA baseado em dados reais FVS/PE</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveContent}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Salvar Referências
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
