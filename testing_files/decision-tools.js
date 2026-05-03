const sliders = {
    clarity: document.getElementById('reqClarity'),
    size: document.getElementById('projectSize'),
    experience: document.getElementById('teamExp'),
    complexity: document.getElementById('complexity'),
    timeline: document.getElementById('timeline')
};

function initThemeToggle() {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('idFrameworkTheme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', initialTheme);

    const headerContainer = document.querySelector('.header .container');
    if (!headerContainer || document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');

    function syncToggle(theme) {
        const isDark = theme === 'dark';
        toggle.innerHTML = isDark
            ? '<i class="fas fa-sun"></i><span>Light</span>'
            : '<i class="fas fa-moon"></i><span>Dark</span>';
        toggle.setAttribute('aria-pressed', String(isDark));
    }

    syncToggle(initialTheme);
    headerContainer.insertBefore(toggle, headerContainer.querySelector('.mobile-menu-btn'));

    toggle.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('idFrameworkTheme', nextTheme);
        syncToggle(nextTheme);
        window.dispatchEvent(new CustomEvent('id-theme-change', { detail: { theme: nextTheme } }));
    });
}

initThemeToggle();

const output = {
    clarityValue: document.getElementById('reqClarityValue'),
    sizeValue: document.getElementById('projectSizeValue'),
    experienceValue: document.getElementById('teamExpValue'),
    complexityValue: document.getElementById('complexityValue'),
    timelineValue: document.getElementById('timelineValue'),
    riskScore: document.getElementById('riskScore'),
    riskLevel: document.getElementById('riskLevel'),
    riskFill: document.getElementById('riskFill'),
    costEstimate: document.getElementById('costEstimate'),
    costFill: document.getElementById('costFill'),
    sdlcMetric: document.getElementById('sdlcMetric'),
    sdlcRule: document.getElementById('sdlcRule'),
    modelName: document.getElementById('modelName'),
    modelReason: document.getElementById('modelReason'),
    modelBadge: document.getElementById('modelBadgeLight'),
    riskFormulaValues: document.getElementById('riskFormulaValues'),
    costFormulaValues: document.getElementById('costFormulaValues'),
    riskDistributionValues: document.getElementById('riskDistributionValues'),
    riskTimelineValues: document.getElementById('riskTimelineValues'),
    complexityContribution: document.getElementById('complexityContribution'),
    timelineContribution: document.getElementById('timelineContribution'),
    experienceContribution: document.getElementById('experienceContribution')
};

let riskDistributionChart;
let riskTimelineChart;

const modelReasons = {
    Spiral: 'Selected because Risk > 60. Spiral supports iterative risk analysis for high-risk projects.',
    Waterfall: 'Selected because Clarity > 70 and Risk <= 60. Waterfall fits clear and stable requirements.',
    Agile: 'Selected because Clarity < 40. Agile fits unclear or frequently changing requirements.',
    RAD: 'Selected because Size > 70 and risk is moderate. RAD supports faster development cycles for large projects.',
    Prototyping: 'Selected because Clarity is between 40 and 60. Prototyping helps refine partially defined requirements.',
    Incremental: 'Selected as the balanced approach for moderate project conditions.'
};

function readInputs() {
    return {
        clarity: Number(sliders.clarity.value),
        size: Number(sliders.size.value),
        experience: Number(sliders.experience.value),
        complexity: Number(sliders.complexity.value),
        timeline: Number(sliders.timeline.value)
    };
}

function calculateRisk(values) {
    return (values.complexity + values.timeline + (100 - values.experience)) / 3;
}

function calculateCost(values) {
    return values.size * (1 + values.complexity / 100 + values.timeline / 100);
}

function getRiskLevel(risk) {
    if (risk > 60) return 'High Risk';
    if (risk >= 40) return 'Medium Risk';
    return 'Low Risk';
}

function isModerateRisk(risk) {
    return risk >= 40 && risk <= 60;
}

function recommendModel(values, risk) {
    if (risk > 60) return 'Spiral';
    if (values.clarity > 70 && risk <= 60) return 'Waterfall';
    if (values.clarity < 40) return 'Agile';
    if (values.size > 70 && isModerateRisk(risk)) return 'RAD';
    if (values.clarity >= 40 && values.clarity <= 60) return 'Prototyping';
    return 'Incremental';
}

function formatNumber(value) {
    return value.toFixed(2);
}

function getRiskContributions(values) {
    const contributions = [
        { label: 'Complexity', value: values.complexity },
        { label: 'Timeline', value: values.timeline },
        { label: 'Inverse Experience', value: 100 - values.experience }
    ];
    const total = contributions.reduce((sum, item) => sum + item.value, 0);

    return contributions.map((item) => ({
        ...item,
        percent: total === 0 ? 0 : (item.value / total) * 100
    }));
}

function updateLiveSliderValues(values) {
    output.clarityValue.textContent = values.clarity;
    output.sizeValue.textContent = values.size;
    output.experienceValue.textContent = values.experience;
    output.complexityValue.textContent = values.complexity;
    output.timelineValue.textContent = values.timeline;
}

function updateOutputs(values, risk, cost, model) {
    const riskLevel = getRiskLevel(risk);

    output.riskScore.textContent = formatNumber(risk);
    output.riskLevel.textContent = riskLevel;
    output.riskFill.style.width = `${risk}%`;
    output.costEstimate.textContent = formatNumber(cost);
    output.costFill.style.width = `${Math.min(100, cost / 2)}%`;
    output.sdlcMetric.textContent = model;
    output.sdlcRule.textContent = model === 'RAD' ? 'Size > 70 and Moderate Risk' : modelReasons[model].split('.')[0];
    output.modelName.textContent = model;
    output.modelReason.textContent = modelReasons[model];
    output.modelBadge.innerHTML = `<i class="fas fa-microchip"></i> ${model} Recommended`;
    output.riskFormulaValues.textContent =
        `Risk = (${values.complexity} + ${values.timeline} + (100 - ${values.experience})) / 3 = ${formatNumber(risk)}`;
    output.costFormulaValues.textContent =
        `Cost = ${values.size} x (1 + ${values.complexity}/100 + ${values.timeline}/100) = ${formatNumber(cost)}`;
    const contributions = getRiskContributions(values);
    output.complexityContribution.textContent =
        `${formatNumber(contributions[0].percent)}% contribution · value ${contributions[0].value}`;
    output.timelineContribution.textContent =
        `${formatNumber(contributions[1].percent)}% contribution · value ${contributions[1].value}`;
    output.experienceContribution.textContent =
        `${formatNumber(contributions[2].percent)}% contribution · value ${contributions[2].value}`;
    output.riskDistributionValues.textContent =
        `Total Risk ${formatNumber(risk)} = (${values.complexity} + ${values.timeline} + ${100 - values.experience}) / 3`;
    output.riskTimelineValues.textContent =
        `Current point: Timeline ${values.timeline}, Risk ${formatNumber(risk)}`;
}

function makeTimelineSeries(values) {
    const basePoints = [0, 20, 40, 60, 80, 100, values.timeline];
    const timelinePoints = [...new Set(basePoints)].sort((a, b) => a - b);

    return timelinePoints.map((timeline) => ({
        x: timeline,
        y: Number(formatNumber(calculateRisk({ ...values, timeline })))
    }));
}

function createRiskLineGradient(context) {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return '#f59e0b';

    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');
    return gradient;
}

function cssColor(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function applyChartTheme() {
    const textColor = cssColor('--text-primary', '#0f172a');
    const secondaryColor = cssColor('--text-secondary', '#475569');
    const gridColor = cssColor('--chart-grid', 'rgba(148, 163, 184, 0.22)');

    if (riskTimelineChart) {
        riskTimelineChart.options.scales.x.title.color = secondaryColor;
        riskTimelineChart.options.scales.x.ticks.color = secondaryColor;
        riskTimelineChart.options.scales.x.grid.color = gridColor;
        riskTimelineChart.options.scales.y.title.color = secondaryColor;
        riskTimelineChart.options.scales.y.ticks.color = secondaryColor;
        riskTimelineChart.options.scales.y.grid.color = gridColor;
        riskTimelineChart.options.plugins.legend.labels.color = textColor;
        riskTimelineChart.update('none');
    }

    if (riskDistributionChart) {
        riskDistributionChart.update('none');
    }
}

const donutCenterTextPlugin = {
    id: 'donutCenterText',
    afterDatasetsDraw(chart, args, pluginOptions) {
        if (chart.config.type !== 'doughnut') return;
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        const risk = pluginOptions.risk || 0;
        const level = pluginOptions.level || 'Low Risk';

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = cssColor('--text-primary', '#0f172a');
        ctx.font = '700 26px Inter, sans-serif';
        ctx.fillText(formatNumber(risk), centerX, centerY - 8);
        ctx.fillStyle = cssColor('--text-secondary', '#64748b');
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillText('TOTAL RISK', centerX, centerY + 15);
        ctx.fillStyle = risk > 60 ? '#ef4444' : risk >= 40 ? '#f59e0b' : '#10b981';
        ctx.font = '700 10px Inter, sans-serif';
        ctx.fillText(level.toUpperCase(), centerX, centerY + 32);
        ctx.restore();
    }
};

const donutSegmentLabelPlugin = {
    id: 'donutSegmentLabels',
    afterDatasetsDraw(chart) {
        if (chart.config.type !== 'doughnut') return;
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const data = dataset.data;
        const total = data.reduce((sum, value) => sum + value, 0);
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 10px Inter, sans-serif';

        meta.data.forEach((arc, index) => {
            if (!data[index]) return;
            const position = arc.tooltipPosition();
            const percent = total === 0 ? 0 : (data[index] / total) * 100;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${formatNumber(percent)}%`, position.x, position.y - 6);
            ctx.font = '600 10px Inter, sans-serif';
            ctx.fillText(`${data[index]}`, position.x, position.y + 8);
            ctx.font = '700 10px Inter, sans-serif';
        });
        ctx.restore();
    }
};

const currentTimelineGuidePlugin = {
    id: 'currentTimelineGuide',
    afterDatasetsDraw(chart, args, pluginOptions) {
        if (!pluginOptions || typeof pluginOptions.timeline !== 'number') return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.x) return;

        const x = scales.x.getPixelForValue(pluginOptions.timeline);
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.font = '700 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Current', x, chartArea.top + 12);
        ctx.restore();
    }
};

const linePointLabelsPlugin = {
    id: 'linePointLabels',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        if (!dataset || !meta || meta.hidden) return;

        ctx.save();
        ctx.font = '700 10px Inter, sans-serif';
        ctx.fillStyle = cssColor('--text-primary', '#334155');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        meta.data.forEach((point, index) => {
            const value = dataset.data[index]?.y;
            if (typeof value !== 'number') return;
            ctx.fillText(formatNumber(value), point.x, point.y - 9);
        });
        ctx.restore();
    }
};

Chart.register(donutCenterTextPlugin, donutSegmentLabelPlugin, currentTimelineGuidePlugin, linePointLabelsPlugin);

function initCharts() {
    const riskCtx = document.getElementById('riskChartLight')?.getContext('2d');
    const timelineCtx = document.getElementById('riskTimelineChart')?.getContext('2d');
    const initialValues = readInputs();
    const initialRisk = calculateRisk(initialValues);

    if (riskCtx) {
        riskDistributionChart = new Chart(riskCtx, {
            type: 'doughnut',
            data: {
                labels: ['Complexity', 'Timeline Pressure', 'Experience Contribution (100 - Experience)'],
                datasets: [{
                    data: [
                        initialValues.complexity,
                        initialValues.timeline,
                        100 - initialValues.experience
                    ],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderColor: '#ffffff',
                    borderRadius: 8,
                    borderWidth: 4,
                    hoverOffset: 8,
                    spacing: 2
                }]
            },
            options: {
                cutout: '68%',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 650,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    donutCenterText: {
                        risk: initialRisk,
                        level: getRiskLevel(initialRisk)
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const data = context.dataset.data;
                                const total = data.reduce((sum, value) => sum + value, 0);
                                const percent = total === 0 ? 0 : (context.parsed / total) * 100;
                                return `${context.label}: ${context.parsed} (${formatNumber(percent)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    if (timelineCtx) {
        riskTimelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Formula Risk',
                        data: [],
                        borderColor: createRiskLineGradient,
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) return 'rgba(245, 158, 11, 0.12)';
                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
                            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
                            gradient.addColorStop(1, 'rgba(16, 185, 129, 0.04)');
                            return gradient;
                        },
                        fill: true,
                        borderWidth: 4,
                        tension: 0.45,
                        cubicInterpolationMode: 'monotone',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#334155',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Current Timeline/Risk',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: '#ef4444',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 8,
                        pointHoverRadius: 10,
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                parsing: false,
                animation: {
                    duration: 550,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    currentTimelineGuide: {
                        timeline: initialValues.timeline
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                            font: { size: 11, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        padding: 12,
                        callbacks: {
                            label: (context) => `Timeline ${context.parsed.x}, Risk ${formatNumber(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: 0,
                        max: 100,
                        title: { display: true, text: 'Timeline Pressure' },
                        ticks: { stepSize: 20 },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.22)',
                            drawBorder: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Risk' },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.22)',
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
}

function updateCharts(values, risk) {
    if (riskDistributionChart) {
        riskDistributionChart.data.datasets[0].data = [
            values.complexity,
            values.timeline,
            100 - values.experience
        ];
        riskDistributionChart.options.plugins.donutCenterText.risk = risk;
        riskDistributionChart.options.plugins.donutCenterText.level = getRiskLevel(risk);
        riskDistributionChart.update();
    }

    if (riskTimelineChart) {
        riskTimelineChart.data.datasets[0].data = makeTimelineSeries(values);
        riskTimelineChart.data.datasets[1].data = [{ x: values.timeline, y: Number(formatNumber(risk)) }];
        riskTimelineChart.options.plugins.currentTimelineGuide.timeline = values.timeline;
        riskTimelineChart.update();
    }
}

window.addEventListener('id-theme-change', applyChartTheme);

function updateDecisionTool() {
    const values = readInputs();
    const risk = calculateRisk(values);
    const cost = calculateCost(values);
    const model = recommendModel(values, risk);

    updateLiveSliderValues(values);
    updateOutputs(values, risk, cost, model);
    updateCharts(values, risk);
}

Object.values(sliders).forEach((slider) => {
    slider.addEventListener('input', updateDecisionTool);
});

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    applyChartTheme();
    updateDecisionTool();
});
