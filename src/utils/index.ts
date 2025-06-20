/**
 * 节流函数类型定义
 * @param args - 函数参数
 */
type ThrottleFunction<T extends any[]> = (...args: T) => void;

/**
 * 节流配置选项
 */
interface ThrottleOptions {
  /**
   * 节流时间间隔（毫秒）
   * @default 300
   */
  delay?: number;
  
  /**
   * 是否在节流开始前立即执行
   * @default true
   */
  leading?: boolean;
  
  /**
   * 是否在节流结束后执行最后一次调用
   * @default false
   */
  trailing?: boolean;
}

/**
 * 节流函数 - 限制函数执行频率
 * @param func - 需要节流的函数
 * @param options - 节流配置选项
 * @returns 包装后的节流函数
 */
export const throttle = function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  options: ThrottleOptions = {}
): ThrottleFunction<T> {
  // 设置默认值
  const {
    delay = 300,
    leading = true,
    trailing = false
  } = options;
  
  // 内部状态变量
  let lastExecTime = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: T | null = null;
  let lastContext: any = null;
  
  // 清除定时器的辅助函数
  const clearTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
  
  // 实际执行函数的封装
  const execute = (context: any, args: T) => {
    lastExecTime = Date.now();
    func.apply(context, args);
  };
  
  // 返回的节流函数
  return function(this: any, ...args: T) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastExecTime;
    
    lastContext = this;
    lastArgs = args;
    
    // 清除之前的定时器
    clearTimer();
    
    // 第一次执行或已过延迟时间
    if (lastExecTime === 0 && leading) {
      execute(this, args);
      lastExecTime = currentTime;
      return;
    }
    
    // 检查是否过了节流时间间隔
    if (elapsedTime > delay) {
      execute(this, args);
      lastExecTime = currentTime;
      return;
    }
    
    // 设置定时器以执行最后一次调用（如果开启trailing）
    if (trailing) {
      timerId = setTimeout(() => {
        if (lastArgs !== null) {
          execute(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
        lastExecTime = Date.now();
      }, delay - elapsedTime);
    }
  };
}