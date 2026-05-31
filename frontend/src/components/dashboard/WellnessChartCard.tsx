import { Box, Group, Text } from '@mantine/core';
import { IconChevronDown, IconSparkles } from '@tabler/icons-react';
import { wellnessData } from '../../mocks/data';
import { palette } from '../../theme';

const W = 520;
const H = 170;
const PAD_X = 24;
const PAD_TOP = 28;
const PAD_BOTTOM = 28;
const MIN = 2;
const MAX = 5;

function buildPoints() {
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  return wellnessData.map((d, i) => {
    const x = PAD_X + (innerW * i) / (wellnessData.length - 1);
    const y = PAD_TOP + innerH * (1 - (d.value - MIN) / (MAX - MIN));
    return { ...d, x, y };
  });
}

export function WellnessChartCard() {
  const pts = buildPoints();
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${PAD_X},${H - PAD_BOTTOM} ${line} ${W - PAD_X},${H - PAD_BOTTOM}`;
  const last = pts[pts.length - 1];

  return (
    <Box className="psi-card" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700} fz={16}>
          Acompanhamento do Bem-estar
        </Text>
        <Group
          gap={6}
          px={12}
          py={6}
          style={{
            background: '#fff',
            border: `1px solid ${palette.border}`,
            borderRadius: 999,
          }}
        >
          <Text fz={12} fw={500} c={palette.textSecondary}>
            Últimos 7 dias
          </Text>
          <IconChevronDown size={14} color={palette.textSecondary} />
        </Group>
      </Group>

      <Box style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5F9E6E" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#5F9E6E" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[5, 4, 3, 2].map((g) => {
            const innerH = H - PAD_TOP - PAD_BOTTOM;
            const y = PAD_TOP + innerH * (1 - (g - MIN) / (MAX - MIN));
            return (
              <g key={g}>
                <line
                  x1={PAD_X}
                  y1={y}
                  x2={W - PAD_X}
                  y2={y}
                  stroke={palette.border}
                  strokeDasharray="3 5"
                />
                <text x={0} y={y + 4} fontSize={11} fill={palette.textSecondary}>
                  {g}
                </text>
              </g>
            );
          })}

          <polygon points={area} fill="url(#wellGrad)" />
          <polyline
            points={line}
            fill="none"
            stroke="#5F9E6E"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === pts.length - 1 ? 5.5 : 3.5}
              fill="#fff"
              stroke="#5F9E6E"
              strokeWidth={2.5}
            />
          ))}

          {/* current marker badge */}
          <g transform={`translate(${last.x - 28}, ${last.y - 40})`}>
            <rect width="56" height="26" rx="8" fill={palette.greenDark} />
            <text
              x="28"
              y="17"
              fontSize="12"
              fontWeight="600"
              fill="#fff"
              textAnchor="middle"
            >
              3,8 Hoje
            </text>
          </g>

          {pts.map((p, i) => (
            <text
              key={`l-${i}`}
              x={p.x}
              y={H - 6}
              fontSize={11}
              fill={palette.textSecondary}
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </Box>

      <Group
        gap={10}
        mt="md"
        p={14}
        wrap="nowrap"
        style={{
          background: 'rgba(95,127,98,0.08)',
          borderRadius: 16,
        }}
      >
        <IconSparkles size={20} color={palette.green} />
        <Text fz={13} c={palette.textPrimary}>
          Pequenos passos todos os dias fazem uma grande diferença.
        </Text>
      </Group>
    </Box>
  );
}
