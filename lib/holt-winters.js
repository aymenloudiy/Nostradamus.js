function forecast(data, alpha, beta, gamma, period, m) {
  if (!validArgs(data, alpha, beta, gamma, period, m)) return [];

  let seasons = Math.floor(data.length / period);
  let st_1 = data[0];
  let b_1 = initialTrend(data, period);
  let seasonal = seasonalIndices(data, period, seasons);

  return calcHoltWinters(
    data,
    st_1,
    b_1,
    alpha,
    beta,
    gamma,
    seasonal,
    period,
    m
  );
}

export default forecast;

function validArgs(data, alpha, beta, gamma, period, m) {
  return (
    data.length > 0 &&
    m > 0 &&
    alpha >= 0.0 &&
    alpha <= 1.0 &&
    beta >= 0.0 &&
    beta <= 1.0 &&
    gamma >= 0.0 &&
    gamma <= 1.0
  );
}

function initialTrend(data, period) {
  if (data.length < 2 * period) return 0;
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[period + i] - data[i];
  }
  return sum / Math.max(1, period * period);
}

function seasonalIndices(data, period, seasons) {
  let savg = new Array(seasons).fill(0);
  let si = new Array(period).fill(0);

  for (let i = 0; i < seasons; i++) {
    for (let j = 0; j < period; j++) {
      savg[i] += data[i * period + j];
    }
    savg[i] /= period;
  }

  for (let i = 0; i < period; i++) {
    for (let j = 0; j < seasons; j++) {
      si[i] += data[j * period + i] / (savg[j] || 1);
    }
    si[i] /= seasons;
  }

  return si;
}

function calcHoltWinters(
  data,
  st_1,
  b_1,
  alpha,
  beta,
  gamma,
  seasonal,
  period,
  m
) {
  let len = data.length;
  let st = new Array(len).fill(0);
  let bt = new Array(len).fill(0);
  let it = new Array(len).fill(0);
  let ft = new Array(len).fill(0);

  st[1] = st_1;
  bt[1] = b_1;

  for (let i = 0; i < period; i++) {
    it[i] = seasonal[i] || 1;
  }

  for (let i = 2; i < len; i++) {
    let seasonalIndex = it[i - period] || 1;

    st[i] =
      (alpha * data[i]) / seasonalIndex +
      (1.0 - alpha) * (st[i - 1] + bt[i - 1]);

    bt[i] = gamma * (st[i] - st[i - 1]) + (1 - gamma) * bt[i - 1];

    it[i] = (beta * data[i]) / st[i] + (1.0 - beta) * seasonalIndex;

    if (i + m < len) {
      ft[i + m] = (st[i] + m * bt[i]) * it[(i - period + m) % period];
    }
  }

  return ft;
}
