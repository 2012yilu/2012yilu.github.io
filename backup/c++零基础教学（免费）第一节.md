c++零基础教学（免费）第一节
欢迎各位对c++感兴趣的同学们。 开始前，请准备一下物品：1：纸和笔2：笔记本 3：下载dev-c++ (自行下载并了解)4：一台电脑（台式机或笔记本）
正文开始：-------------------------------------------------------------------------
首先，我们先了解c++是什么：C++（c plus plus）是一种计算机高级程序设计语言，由[C语言](https://baike.baidu.com/item/C%E8%AF%AD%E8%A8%80/105958?fromModule=lemma_inlink)扩展升级而产生 [17]，最早于1979年由[本贾尼·斯特劳斯特卢普](https://baike.baidu.com/item/%E6%9C%AC%E8%B4%BE%E5%B0%BC%C2%B7%E6%96%AF%E7%89%B9%E5%8A%B3%E6%96%AF%E7%89%B9%E5%8D%A2%E6%99%AE/10613051?fromModule=lemma_inlink)在AT&T贝尔工作室研发。 [2]

C++既可以进行C语言的过程化[程序设计](https://baike.baidu.com/item/%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/223952?fromModule=lemma_inlink)，又可以进行以[抽象数据类型](https://baike.baidu.com/item/%E6%8A%BD%E8%B1%A1%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B/3227531?fromModule=lemma_inlink)为特点的基于对象的程序设计，还可以进行以继承和多态为特点的面向对象的程序设计。C++擅长面向对象程序设计的同时，还可以进行基于过程的程序设计。 C++几乎可以创建任何类型的程序：游戏、[设备驱动程序](https://baike.baidu.com/item/%E8%AE%BE%E5%A4%87%E9%A9%B1%E5%8A%A8%E7%A8%8B%E5%BA%8F/310766?fromModule=lemma_inlink)、[HPC](https://baike.baidu.com/item/HPC/16007677?fromModule=lemma_inlink)、[云](https://baike.baidu.com/item/%E4%BA%91/2363180?fromModule=lemma_inlink)、[桌面](https://baike.baidu.com/item/%E6%A1%8C%E9%9D%A2/4773626?fromModule=lemma_inlink)、[嵌入式](https://baike.baidu.com/item/%E5%B5%8C%E5%85%A5%E5%BC%8F/575465?fromModule=lemma_inlink)和[移动应用](https://baike.baidu.com/item/%E7%A7%BB%E5%8A%A8%E5%BA%94%E7%94%A8/4781098?fromModule=lemma_inlink)等。 甚至用于其他[编程语言](https://baike.baidu.com/item/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/9845131?fromModule=lemma_inlink)的库和[编译器](https://baike.baidu.com/item/%E7%BC%96%E8%AF%91%E5%99%A8/8853067?fromModule=lemma_inlink)也使用C++编写。 [25]

C++拥有计算机运行的实用性特征，同时还致力于提高大规模程序的编程质量与程序设计语言的问题描述能力。
现在，我会教你一些基础语言：
1：框架：
一个程序，必不可少的就是框架、

include< iostream>
using namespace std;
int main()
{
return 0;
}
现在，解说一下每个部分。
include< iostream>：这是引入头文件 其中<>中就是头文件，头文件有很多，如iostream,algorithm,cstring,string,cmath等等（后续会学习到）
using namespace std;是命名
int main() ：是主函数（后续会学到子函数）

2：输出cout
格式如下：

cout<< ;

<< ;中间可以是变量（后续会学习到），文本，数字等等
现在先学如何输出文本和数字
文本：

cout<< ”你想输出的文本“ ;

数字：

cout<< 1 ;
cout<< 2；
以此类推

快去dev-c++试一下吧；

拓展：
和cout相似的输出函数（比cout快）：printf（后续会深入学习）

本节课就学到这里，下节课再见~
声明：本资料仅供参考学习，不作任何商业内容，如想更正规的学习，建议去正规的教育机构学习。转载此文章请注明原出处，谢谢