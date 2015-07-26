CC = gcc
JAVAC = javac
JAVAH = javah

LIB = ../../KLT210g/libindex.a
INC = /usr/java/include
OPT = -fPIC -c
OUT = ../bin/libKLT2000JNI.so

$(OUT) : KLT2000JNI.o NativeStringUtil.o
	$(CC) -shared -o $(OUT) KLT2000JNI.o NativeStringUtil.o $(LIB)

KLT2000JNI.o : src/KLT2000JNI.c
	$(CC) $(OPT) src/KLT2000JNI.c -I$(INC)

NativeStringUtil.o : src/NativeStringUtil.c
	$(CC) $(OPT) src/NativeStringUtil.c -I$(INC)

clean :
	@rm *.o
	@rm $(OUT)
